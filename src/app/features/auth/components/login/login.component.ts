import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService, UserDto } from '../../../../core/services/api.service';
import { AuthService, User } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  isLoading = false;
  showPassword = false;
  errorMessage = '';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private apiService: ApiService,
    private authService: AuthService
  ) {
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(3)]],
      rememberMe: [false]
    });
  }

  ngOnInit(): void {
    // Check if user is already logged in and redirect accordingly
    if (this.authService.isLoggedIn()) {
      this.redirectBasedOnRole();
    }
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const { username, password, rememberMe } = this.loginForm.value;

      // Use API service for login
      this.apiService.login(username, password).subscribe({
        next: (response: UserDto) => {
          // Convert UserDto to User and store using auth service
          const user: User = {
            id: response.id || 0,
            username: response.username,
            password: response.password || '',
            role: response.role || 'USER' // Default to USER if role is not provided
          };
          
          this.authService.setCurrentUser(user);
          
          if (rememberMe) {
            localStorage.setItem('rememberMe', 'true');
          }
          
          // Show success message
          this.errorMessage = '';
          alert(`Login successful! Welcome to MovieHub! 🎬`);
          
          // Navigate based on user role
          this.redirectBasedOnRole();
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Login error:', error);
          this.errorMessage = error.message || 'Login failed. Please check your credentials and try again.';
          this.isLoading = false;
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.loginForm.controls).forEach(key => {
      const control = this.loginForm.get(key);
      control?.markAsTouched();
    });
  }

  getFieldError(fieldName: string): string {
    const field = this.loginForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) {
        return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
      }
      if (field.errors['minlength']) {
        if (fieldName === 'username') {
          return 'Username must be at least 3 characters long';
        } else {
          return 'Password must be at least 3 characters long';
        }
      }
    }
    return '';
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    return !!(field?.invalid && field.touched);
  }

  private redirectBasedOnRole(): void {
    const user = this.authService.getCurrentUser();
    if (user) {
      if (user.role === 'ADMIN') {
        this.router.navigate(['/admin-dashboard']);
      } else if (user.role === 'USER') {
        this.router.navigate(['/user-dashboard']);
      } else {
        // Fallback to user dashboard for unknown roles
        this.router.navigate(['/user-dashboard']);
      }
    }
  }
}