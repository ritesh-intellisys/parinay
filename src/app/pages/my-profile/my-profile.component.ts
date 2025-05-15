import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../auth/auth.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db, storage } from '../../core/firebase-config';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { updateProfile, User } from 'firebase/auth';

@Component({
  selector: 'app-my-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FontAwesomeModule],
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.css']
})
export class MyProfileComponent implements OnInit {
  private authService: AuthService = inject(AuthService);
  private fb: FormBuilder = inject(FormBuilder);
  private router: Router = inject(Router);
  private toastr: ToastrService = inject(ToastrService);

  user: any = null;
  isEditing = false;
  isSubmitting = false;
  profileForm!: FormGroup;

  async ngOnInit() {
    await this.loadUserData();
  }

  async loadUserData() {
    const currentUser: User | null = this.authService.getCurrentUser();
    if (!currentUser) {
      this.router.navigate(['/login']);
      return;
    }

    try {
      // Fetch user data from Firestore
      const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
      if (userDoc.exists()) {
        this.user = { 
          ...userDoc.data(), 
          email: currentUser.email,
          photoURL: currentUser.photoURL || userDoc.data()['photoURL'],
          uid: currentUser.uid
        };
      } else {
        // Create basic user document if it doesn't exist
        await updateDoc(doc(db, 'users', currentUser.uid), {
          fullName: currentUser.displayName || '',
          email: currentUser.email,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
        this.user = {
          fullName: currentUser.displayName || '',
          email: currentUser.email,
          photoURL: currentUser.photoURL || '',
          uid: currentUser.uid
        };
      }
    } catch (error) {
      this.toastr.error('Failed to load profile', 'Error');
      console.error(error);
    }
  }

  initForm() {
    this.profileForm = this.fb.group({
      fullName: [this.user.fullName || '', [Validators.required, Validators.minLength(2)]],
      age: [this.user.age || '', [Validators.min(18), Validators.max(100)]],
      city: [this.user.city || ''],
      gender: [this.user.gender || ''],
      religion: [this.user.religion || ''],
      caste: [this.user.caste || ''],
      height: [this.user.height || ''],
      about: [this.user.about || ''],
      occupation: [this.user.occupation || ''],
      education: [this.user.education || ''],
      income: [this.user.income || ''],
      phone: [this.user.phone || '', [Validators.pattern(/^[0-9\+\-\s]+$/)]],
      motherTongue: [this.user.motherTongue || ''],
      maritalStatus: [this.user.maritalStatus || ''],
      preferredAge: [this.user.preferredAge || ''],
      preferredHeight: [this.user.preferredHeight || ''],
      preferredReligion: [this.user.preferredReligion || '']
    });
  }

  toggleEdit() {
    this.isEditing = !this.isEditing;
    if (this.isEditing) {
      this.initForm();
    }
  }

  async onSubmit() {
    if (this.profileForm.invalid || this.isSubmitting) return;

    this.isSubmitting = true;
    try {
      const currentUser = this.authService.getCurrentUser();
      if (!currentUser) throw new Error('User not authenticated');

      // Prepare update data
      const updateData = {
        ...this.profileForm.value,
        updatedAt: serverTimestamp()
      };

      // Update Firestore
      await updateDoc(doc(db, 'users', currentUser.uid), updateData);
      
      // Update auth profile if name changed
      if (this.profileForm.value.fullName !== this.user.fullName) {
        await updateProfile(currentUser, {
          displayName: this.profileForm.value.fullName
        });
      }

      // Reload user data to ensure we have the latest from Firestore
      await this.loadUserData();
      
      this.toastr.success('Profile updated successfully!', 'Success');
      this.isEditing = false;
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.toastr.error(error.message || 'Failed to update profile', 'Error');
      } else {
        this.toastr.error('An unknown error occurred', 'Error');
      }
      console.error(error);
    } finally {
      this.isSubmitting = false;
    }
  }

  async uploadPhoto() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    
    input.onchange = async (event: Event) => {
      const target = event.target as HTMLInputElement;
      const file = target.files?.[0];
      
      if (!file) return;
      
      // Validate file type and size
      if (!file.type.match('image.*')) {
        this.toastr.error('Please select an image file', 'Invalid File');
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        this.toastr.error('Image size should be less than 5MB', 'File Too Large');
        return;
      }

      try {
        const currentUser = this.authService.getCurrentUser();
        if (!currentUser) return;

        this.toastr.info('Uploading profile picture...', 'Please wait');
        
        // Delete old photo if exists
        if (this.user.photoURL && this.user.photoURL.includes('firebasestorage.googleapis.com')) {
          try {
            const oldPhotoRef = ref(storage, this.user.photoURL);
            await deleteObject(oldPhotoRef);
          } catch (error) {
            console.warn('Failed to delete old photo', error);
          }
        }
        
        // Upload to Firebase Storage
        const filePath = `profile-pictures/${currentUser.uid}/${Date.now()}_${file.name}`;
        const storageRef = ref(storage, filePath);
        const snapshot = await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(snapshot.ref);

        // Update user profile in auth
        await updateProfile(currentUser, { photoURL: downloadURL });
        
        // Update user document in Firestore
        await updateDoc(doc(db, 'users', currentUser.uid), { 
          photoURL: downloadURL,
          updatedAt: serverTimestamp()
        });

        // Update local user data
        this.user.photoURL = downloadURL;
        this.toastr.success('Profile picture updated successfully!', 'Success');
      } catch (error: unknown) {
        if (error instanceof Error) {
          this.toastr.error(error.message || 'Failed to upload photo', 'Error');
        } else {
          this.toastr.error('An unknown error occurred', 'Error');
        }
        console.error(error);
      }
    };
    
    input.click();
  }

  logout() {
    this.authService.logout().subscribe({
      next: () => {
        this.toastr.success('Logged out successfully', 'Success');
        this.router.navigate(['/login']);
      },
      error: (error: Error) => {
        this.toastr.error(error.message || 'Logout failed', 'Error');
      }
    });
  }
}