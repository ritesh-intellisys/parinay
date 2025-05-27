// auth.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable, from, switchMap, of, tap } from 'rxjs';

export interface AppUser {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  // Add any other properties your user object should have
}

interface UserProfile {
  uid: string;
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
  photoURL?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5000/api/auth';

  constructor(private http: HttpClient) {}

  private router = inject(Router);
  private toastr = inject(ToastrService);

  // Mock user for demonstration - replace with real auth implementation
  private currentUser: AppUser | null = null;

  // Auth state observable
  authState$: Observable<AppUser | null> = of(this.currentUser);

  /**
   * Login with email/password
   */
  login(credentials: { email: string; password: string }): Observable<any> {
  return this.http.post(`${this.apiUrl}/login`, credentials);
}


  /**
   * Register new user
   */
register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData);
  }

  

  /**
   * Google login
   */
  loginWithGoogle(): Observable<void> {
    // Mock implementation - replace with real auth
    this.currentUser = {
      uid: 'google-uid-' + Math.random().toString(36).substring(2),
      displayName: 'Google User',
      email: 'googleuser@example.com',
      photoURL: 'https://example.com/google-avatar.jpg'
    };
    return this.handleAuthSuccess({ user: this.currentUser });
  }

  /**
   * Facebook login
   */
  loginWithFacebook(): Observable<void> {
    // Mock implementation - replace with real auth
    this.currentUser = {
      uid: 'facebook-uid-' + Math.random().toString(36).substring(2),
      displayName: 'Facebook User',
      email: 'facebookuser@example.com',
      photoURL: 'https://example.com/facebook-avatar.jpg'
    };
    return this.handleAuthSuccess({ user: this.currentUser });
  }

  /**
   * Logout
   */
  logout(): Observable<void> {
    return from(Promise.resolve()).pipe(
      tap(() => {
        this.currentUser = null;
        this.router.navigate(['/login']);
        this.toastr.info('You have been logged out', 'Goodbye');
      })
    );
  }

  /**
   * Get current user
   */
  getCurrentUser(): AppUser | null {
    return this.currentUser;
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return this.currentUser !== null;
  }

  /**
   * Handle successful authentication
   */
  private handleAuthSuccess(userCredential: { user: AppUser }): Observable<void> {
    this.currentUser = userCredential.user;
    this.toastr.success('Authentication successful', `Welcome ${userCredential.user.displayName || 'User'}!`);
    this.router.navigate(['/dashboard']);
    return of(undefined);
  }
}