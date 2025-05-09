import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

interface LoginResponse {
  token: string;
  user: {
    fullName: string;
    email: string;
    [key: string]: any; // other user properties
  };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5000/api/auth';
  private tokenKey = 'authToken';
  private userKey = 'currentUser';

  constructor(
    private http: HttpClient,
    private router: Router,
    private toastr: ToastrService
  ) {}

  /**
   * Login user and store token/user info on success.
   */
  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, { email, password }).pipe(
      tap((response) => {
        if (response.token && response.user) {
          localStorage.setItem(this.tokenKey, response.token);
          localStorage.setItem(this.userKey, JSON.stringify(response.user));
          this.toastr.success('Login successful', `Welcome back, ${response.user.fullName}!`);
          this.router.navigate(['/dashboard']);
        }
      }),
      catchError(error => {
        const message = error.error?.message || 'Login failed';
        this.toastr.error(message, 'Error');
        return throwError(() => new Error(message));
      })
    );
  }

  /**
   * Register user and navigate to login on success.
   */
  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData).pipe(
      tap(() => {
        this.toastr.success('Registration successful', 'Welcome!');
        this.router.navigate(['/login']);
      }),
      catchError(error => {
        const message = error.error?.message || 'Registration failed';
        this.toastr.error(message, 'Error');
        return throwError(() => new Error(message));
      })
    );
  }

  /**
   * Logs out the user.
   */
  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    this.router.navigate(['/login']);
    this.toastr.info('You have been logged out', 'Goodbye');
  }

  /**
   * Returns stored JWT token.
   */
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  /**
   * Returns currently logged in user.
   */
  getCurrentUser(): any {
    const user = localStorage.getItem(this.userKey);
    return user ? JSON.parse(user) : null;
  }

  /**
   * Checks whether the user is logged in.
   */
  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}
