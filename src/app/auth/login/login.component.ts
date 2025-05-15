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
    const { email, password } = this.loginForm.value;

    this.authService.login(email, password).subscribe({
      next: () => {
        this.isSubmitting = false;
        // Redirect to desired route after successful login
        this.router.navigate(['/profiles']); 
        this.toastr.success('Login successful!');
      },
      error: (err) => {
        this.isSubmitting = false;
        this.toastr.error(err.message || 'Invalid email or password');
      }
    });
  }

  loginWithGoogle() {
    this.authService.loginWithGoogle().subscribe({
      next: () => {
        // Redirect to desired route after successful Google login
        this.router.navigate(['/profiles']); 
        this.toastr.success('Google login successful!');
      },
      error: (err) => this.toastr.error(err.message || 'Google login failed')
    });
  }

  loginWithFacebook() {
    this.authService.loginWithFacebook().subscribe({
      next: () => {
        // Redirect to desired route after successful Facebook login
        this.router.navigate(['/profiles']); 
        this.toastr.success('Facebook login successful!');
      },
      error: (err) => this.toastr.error(err.message || 'Facebook login failed')
    });
  }

  get f() {
    return this.loginForm.controls;
  }
}