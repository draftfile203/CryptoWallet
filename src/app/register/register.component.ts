import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-register',
  imports: [RouterModule,ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    // Initialize the registration form with validation
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],               // Required valid email
      password: ['', [Validators.required, Validators.minLength(6)]],    // Required password with min 6 chars
      firstname: ['', Validators.required],                              // First name is required
      lastname: ['', Validators.required],                               // Last name is required
      personnumber: ['', Validators.required]                            // Person number is required
    });
  }

  // Triggered when the user submits the registration form
  onSubmit() {
    // Proceed only if the form is valid
    if (this.registerForm.valid) {
      const formData = this.registerForm.value;

      // Call register method from AuthService
      this.authService.register(formData).subscribe(response => {
        // Optionally store the registered user in localStorage
        localStorage.setItem('RegisteredUser', JSON.stringify(formData));
        console.log('user registered:', formData);
      });

      // Show success popup
      Swal.fire({
        title: "SUCCESS",
        text: "You are registered",
        icon: "success",
        background: "#121212",
        color: "#fff",
        iconColor: "#ff66c4",
        confirmButtonColor: "#ff66c4",
        customClass: {
          popup: 'border-radius',
          title: 'swal-title',
          confirmButton: 'swal-button'
        }
      });

      // Reset form and redirect to login
      this.registerForm.reset();
      this.router.navigate(['/login']);
    } else {
      // Show error popup if form is invalid
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong!",
        background: "#121212",
        color: "#fff",
        iconColor: "#ff66c4",
        confirmButtonColor: "#ff66c4",
        customClass: {
          popup: 'border-radius',
          title: 'swal-title',
          confirmButton: 'swal-button'
        }
      });
    }
  }
}