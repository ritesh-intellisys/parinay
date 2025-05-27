import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../auth.service';
import { ToastrService } from 'ngx-toastr';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, FontAwesomeModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.loginForm.invalid || this.isSubmitting) return;

    this.isSubmitting = true;
    const credentials = this.loginForm.value;

    this.authService.login(credentials).subscribe({
      next: (res) => {
        this.isSubmitting = false;
        this.toastr.success('Login successful!');
        this.router.navigate(['/my-profile']); // ✅ Navigate on success
      },
      error: (err) => {
        this.isSubmitting = false;
        this.toastr.error(err.error?.message || 'Invalid email or password', 'Login Failed');
      }
    });
  }


  loginWithGoogle() {
    this.authService.loginWithGoogle().subscribe({
      next: () => {
        // Redirect to desired route after successful Google login
        this.router.navigate(['/my-profile']); 
        this.toastr.success('Google login successful!');
      },
      error: (err) => this.toastr.error(err.message || 'Google login failed')
    });
  }

  loginWithFacebook() {
    this.authService.loginWithFacebook().subscribe({
      next: () => {
        // Redirect to desired route after successful Facebook login
        this.router.navigate(['/my-profile']); 
        this.toastr.success('Facebook login successful!');
      },
      error: (err) => this.toastr.error(err.message || 'Facebook login failed')
    });
  }

  get f() {
    return this.loginForm.controls;
  }
}