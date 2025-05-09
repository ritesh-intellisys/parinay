import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FirebaseService } from '../../services/firebase.service';
import { UserProfile } from '../../models/user.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  userProfile: UserProfile | null = null;
  isEditing = false;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private firebaseService: FirebaseService,
    private toastr: ToastrService
  ) {
    this.profileForm = this.createProfileForm();
  }

  ngOnInit() {
    this.firebaseService.userProfile$.subscribe(profile => {
      this.userProfile = profile;
      if (profile) {
        this.profileForm.patchValue(profile);
      }
    });
  }

  createProfileForm(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required],
      gender: ['', Validators.required],
      birthDay: ['', Validators.required],
      birthMonth: ['', Validators.required],
      birthYear: ['', Validators.required],
      religion: ['', Validators.required],
      caste: ['', Validators.required],
      subcaste: [''],
      mobile: ['', Validators.required],
      country: ['', Validators.required],
      state: ['', Validators.required],
      city: ['', Validators.required],
      motherTongue: ['', Validators.required],
      education: ['', Validators.required],
      occupation: ['', Validators.required],
      income: ['', Validators.required]
    });
  }

  toggleEdit() {
    this.isEditing = !this.isEditing;
    if (!this.isEditing && this.userProfile) {
      this.profileForm.patchValue(this.userProfile);
    }
  }

  async onSubmit() {
    if (this.profileForm.valid && this.userProfile?.id) {
      this.isLoading = true;
      try {
        await this.firebaseService.updateUserProfile(
          this.userProfile.id,
          this.profileForm.value
        );
        this.isEditing = false;
        this.toastr.success('Profile updated successfully');
      } catch (error) {
        this.toastr.error('Failed to update profile');
      } finally {
        this.isLoading = false;
      }
    }
  }

  async onPhotoSelect(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file && this.userProfile?.id) {
      this.isLoading = true;
      try {
        await this.firebaseService.uploadProfilePhoto(this.userProfile.id, file);
        this.toastr.success('Profile photo updated successfully');
      } catch (error) {
        this.toastr.error('Failed to update profile photo');
      } finally {
        this.isLoading = false;
      }
    }
  }
}