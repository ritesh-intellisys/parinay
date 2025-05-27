import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService, AppUser } from '../../auth/auth.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

interface UserProfile {
  fullName: string;
  email: string;
  age?: number;
  city?: string;
  gender?: string;
  religion?: string;
  caste?: string;
  height?: string;
  about?: string;
  occupation?: string;
  education?: string;
  income?: string;
  phone?: string;
  motherTongue?: string;
  maritalStatus?: string;
  preferredAge?: string;
  preferredHeight?: string;
  preferredReligion?: string;
  photoURL?: string;
  createdAt?: Date;
  updatedAt?: Date;
  premium?: boolean;
  uid?: string;
}

@Component({
  selector: 'app-my-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FontAwesomeModule],
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.css']
})
export class MyProfileComponent implements OnInit {
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private toastr = inject(ToastrService);

  user: (AppUser & UserProfile) | null = null;
  isEditing = false;
  isSubmitting = false;
  profileForm!: FormGroup;

  async ngOnInit() {
    await this.loadUserData();
  }

  async loadUserData() {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      this.router.navigate(['/login']);
      return;
    }

    try {
      // In a real implementation, you would fetch user data from your backend
      // This is a mock implementation - replace with your actual API call
      this.user = {
        ...currentUser,
        fullName: currentUser.displayName || '',
        email: currentUser.email || '',
        photoURL: currentUser.photoURL || '',
        age: 30, // Default values - replace with actual data
        city: '',
        gender: '',
        religion: '',
        caste: '',
        height: '',
        about: '',
        occupation: '',
        education: '',
        income: '',
        phone: '',
        motherTongue: '',
        maritalStatus: '',
        preferredAge: '',
        preferredHeight: '',
        preferredReligion: '',
        createdAt: new Date(),
        updatedAt: new Date()
      };
    } catch (error) {
      this.handleError(error, 'Failed to load profile');
    }
  }

  initForm() {
    if (!this.user) return;
    
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
    if (!this.profileForm || this.profileForm.invalid || this.isSubmitting) return;

    this.isSubmitting = true;
    try {
      const currentUser = this.authService.getCurrentUser();
      if (!currentUser) throw new Error('User not authenticated');

      // Prepare update data
      const updateData: Partial<UserProfile> = {
        ...this.profileForm.value,
        updatedAt: new Date()
      };

      // In a real implementation, you would send this to your backend
      // This is a mock implementation - replace with your actual API call
      console.log('Would update profile with:', updateData);
      
      // Update local user data
      if (this.user) {
        this.user = {
          ...this.user,
          ...updateData
        };
      }

      // If name changed, update auth profile
      if (this.profileForm.value.fullName !== this.user?.fullName) {
        // In a real implementation, you would call your auth service to update the profile
        console.log('Would update display name to:', this.profileForm.value.fullName);
      }

      this.toastr.success('Profile updated successfully!', 'Success');
      this.isEditing = false;
    } catch (error: unknown) {
      this.handleError(error, 'Failed to update profile');
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
        if (!currentUser || !this.user) return;

        this.toastr.info('Uploading profile picture...', 'Please wait');
        
        // In a real implementation, you would upload to your backend storage
        // This is a mock implementation - replace with your actual file upload
        const mockFileUrl = URL.createObjectURL(file);
        
        // Update local user data
        this.user.photoURL = mockFileUrl;
        
        // In a real implementation, you would update the profile picture in your backend
        console.log('Would update profile picture to:', mockFileUrl);

        this.toastr.success('Profile picture updated successfully!', 'Success');
      } catch (error: unknown) {
        this.handleError(error, 'Failed to upload photo');
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

  private handleError(error: unknown, defaultMessage: string) {
    if (error instanceof Error) {
      this.toastr.error(error.message || defaultMessage, 'Error');
    } else {
      this.toastr.error(defaultMessage, 'Error');
    }
    console.error(error);
  }
}