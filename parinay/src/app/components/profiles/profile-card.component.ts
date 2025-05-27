
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Profile } from '../../models/profile.model';

@Component({
  selector: 'app-profile-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="rounded-xl shadow-md border p-4 bg-white text-center">
      <img
        *ngIf="profile.photoURL"
        [src]="profile.photoURL"
        alt="Profile photo"
        class="w-24 h-24 rounded-full object-cover mx-auto mb-2"
      />
      <h3 class="text-lg font-semibold">{{ profile.name }}, {{ profile.age }}</h3>
      <p class="text-gray-600 text-sm">{{ profile.gender }}</p>
      <p class="text-gray-700 text-sm">
        {{ profile.location }} | {{ profile.religion }} | {{ profile.caste || 'N/A' }}
      </p>
    </div>
  `
})
export class ProfileCardComponent {
  @Input() profile!: Profile;
}
