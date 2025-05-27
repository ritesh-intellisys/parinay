import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { ToastrService } from 'ngx-toastr';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FontAwesomeModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm: FormGroup;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.registerForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      gender: ['', Validators.required],
      age: ['', [Validators.required, Validators.min(18), Validators.max(100)]],
      city: ['', Validators.required]
    });
  }

  onSubmit() {
  if (this.registerForm.invalid || this.isSubmitting) return;

  const { password, confirmPassword } = this.registerForm.value;
  if (password !== confirmPassword) {
    this.toastr.error('Passwords do not match');
    return;
  }

  this.isSubmitting = true;

  console.log('📤 Sending to backend:', this.registerForm.value); // ✅ Debug

  this.authService.register(this.registerForm.value).subscribe({
    next: () => {
      this.toastr.success('Registration successful!');
      this.router.navigate(['/login']);
      this.isSubmitting = false;
    },
    error: (error) => {
      console.error('❌ Registration failed:', error);
      this.toastr.error(error?.error?.message || 'Registration failed');
      this.isSubmitting = false;
    }
  });
}




  get f() { return this.registerForm.controls; }
}