import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ProfilesService } from '../../services/profiles.service';
import { Profile } from '../../models/profile.model';
import { debounceTime } from 'rxjs/operators';
import { ProfileCardComponent } from '../../components/profiles/profile-card.component';

@Component({
  selector: 'app-profiles',
  templateUrl: './profiles.component.html',
  styleUrls: ['./profiles.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ProfileCardComponent]
})
export class ProfilesComponent implements OnInit {
  allProfiles: Profile[] = [];
  filteredProfiles: Profile[] = [];

  filterForm = new FormGroup({
    name: new FormControl(''),
    religion: new FormControl(''),
    location: new FormControl(''),
    gender: new FormControl(''),
    age: new FormControl(null),
    caste: new FormControl('')
  });

  constructor(private profilesService: ProfilesService) {}

  ngOnInit(): void {
    this.loadProfiles();

    this.filterForm.valueChanges
      .pipe(debounceTime(300))
      .subscribe(values => this.applyFilters(values));
  }

  loadProfiles() {
    this.profilesService.getProfiles().subscribe(profiles => {
      this.allProfiles = profiles;
      this.filteredProfiles = profiles;
    });
  }

  applyFilters(filters: any) {
    this.filteredProfiles = this.allProfiles.filter(profile => {
      const matchesName = !filters.name || profile.name.toLowerCase().includes(filters.name.toLowerCase());
      const matchesReligion = !filters.religion || (profile.religion?.toLowerCase() || '').includes(filters.religion.toLowerCase());
      const matchesLocation = !filters.location || (profile.location?.toLowerCase() ?? '').includes(filters.location.toLowerCase());
      const matchesGender = !filters.gender || profile.gender === filters.gender;
      const matchesCaste = !filters.caste || (profile.caste || '').toLowerCase().includes(filters.caste.toLowerCase());
      const matchesAge = !filters.age || profile.age === filters.age;
      return matchesName && matchesReligion && matchesLocation && matchesGender && matchesCaste && matchesAge;
    });
  }

  deleteProfile(id: string) {
    if (confirm('Are you sure you want to delete this profile?')) {
      this.profilesService.deleteProfile(id).subscribe(() => {
        this.allProfiles = this.allProfiles.filter(p => p._id !== id);
        this.applyFilters(this.filterForm.value);
      });
    }
  }

  trackById(index: number, profile: Profile): string {
    return profile._id;
  }
}
