import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile, UserCredential } from 'firebase/auth';
import { authState } from '@angular/fire/auth';
import { User } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db, googleProvider, facebookProvider } from '../core/firebase-config';
import { Observable, from, switchMap, of, tap } from 'rxjs';

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
  private router = inject(Router);
  private toastr = inject(ToastrService);

  // Firebase auth state observable
  authState$: Observable<User | null> = authState(auth);
  

  /**
   * Login with email/password
   */
  login(email: string, password: string): Observable<void> {
    return from(signInWithEmailAndPassword(auth, email, password)).pipe(
      switchMap((userCredential) => this.handleAuthSuccess(userCredential))
    );
  }

  /**
   * Register new user
   */
  register(userData: any): Observable<void> {
    return from(createUserWithEmailAndPassword(auth, userData.email, userData.password)).pipe(
      switchMap((userCredential) => {
        // Update Firebase user profile with display name
        return from(updateProfile(userCredential.user, {
          displayName: userData.fullName
        })).pipe(
          switchMap(() => {
            // Create user document in Firestore
            const userProfile: UserProfile = {
              uid: userCredential.user.uid,
              fullName: userData.fullName,
              email: userData.email,
              gender: userData.gender,
              age: userData.age,
              city: userData.city
            };
            
            return from(setDoc(doc(db, 'users', userCredential.user.uid), userProfile));
          }),
          switchMap(() => this.handleAuthSuccess(userCredential))
        );
      })
    );
  }

  /**
   * Google login
   */
  loginWithGoogle(): Observable<void> {
    return from(signInWithPopup(auth, googleProvider)).pipe(
      switchMap((userCredential) => this.handleAuthSuccess(userCredential))
    );
  }

  /**
   * Facebook login
   */
  loginWithFacebook(): Observable<void> {
    return from(signInWithPopup(auth, facebookProvider)).pipe(
      switchMap((userCredential) => this.handleAuthSuccess(userCredential))
    );
  }

  /**
   * Logout
   */
  logout(): Observable<void> {
    return from(signOut(auth)).pipe(
      tap(() => {
        this.router.navigate(['/login']);
        this.toastr.info('You have been logged out', 'Goodbye');
      })
    );
  }

  /**
   * Get current user
   */
  getCurrentUser() {
    return auth.currentUser;
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!auth.currentUser;
  }

  /**
   * Handle successful authentication
   */
  private handleAuthSuccess(userCredential: UserCredential): Observable<void> {
    const user = userCredential.user;
    this.toastr.success('Authentication successful', `Welcome ${user.displayName || 'User'}!`);
    this.router.navigate(['/dashboard']);
    return of(undefined);
  }
}