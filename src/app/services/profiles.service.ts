import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Profile } from '../models/profile.model';

@Injectable({ providedIn: 'root' })
export class ProfilesService {
  private baseUrl = '/api/profiles';

  constructor(private http: HttpClient) {}

  getProfiles(): Observable<Profile[]> {
    return this.http.get<Profile[]>(this.baseUrl);
  }

  addProfile(profile: Profile): Observable<Profile> {
    return this.http.post<Profile>(this.baseUrl, profile);
  }

  updateProfile(id: string, data: Partial<Profile>): Observable<Profile> {
    return this.http.put<Profile>(`${this.baseUrl}/${id}`, data);
  }

  uploadPhoto(id: string, formData: FormData): Observable<{ photoURL: string }> {
    return this.http.post<{ photoURL: string }>(`${this.baseUrl}/${id}/photo`, formData);
  }

  deleteProfile(id: string): Observable<{ success: boolean }> {
    return this.http.delete<{ success: boolean }>(`${this.baseUrl}/${id}`);
  }
  getCurrentUser(): Profile | null {
   
    return null; 
  }
}
