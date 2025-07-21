import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  imports: [RouterModule,ReactiveFormsModule,FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    // Initialize the login form with validation rules
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]], // Email is required and must be a valid email format
      password: ['', [Validators.required]] // Password is required
    });
  }

  // Triggered when user submits the login form
  onSubmit() {
    // Proceed only if the form is valid
    if (this.loginForm.valid) {
      const formData = this.loginForm.value;

      // Send login request via AuthService
      this.authService.login(formData).subscribe(response => {

        // If login successful
        if (response.success) {
          // Store user data in local storage
          localStorage.setItem('loggedInUser', JSON.stringify(response.user));

          // Show success notification using SweetAlert
          Swal.fire({
            title: 'Welcome!',
            text: 'You are logged in',
            icon: 'success',
            background: '#121212',
            color: '#fff',
            iconColor: '#ff66c4',
            confirmButtonColor: '#ff66c4',
            customClass: {
              popup: 'border-radius',
              title: 'swal-title',
              confirmButton: 'swal-button'
            }
          });

          // Reset the form and redirect to dashboard
          this.loginForm.reset();
          this.router.navigate(['/dashboard']);
        } 
        // If login fails
        else {
          Swal.fire({
            icon: 'error',
            title: 'Login Failed',
            text: 'Invalid email or password!',
            background: '#121212',
            color: '#fff',
            iconColor: '#ff66c4',
            confirmButtonColor: '#ff66c4',
            customClass: {
              popup: 'border-radius',
              title: 'swal-title',
              confirmButton: 'swal-button'
            }
          });
        }
      });
    }
  }
}
