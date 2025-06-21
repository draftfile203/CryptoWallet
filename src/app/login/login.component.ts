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

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const formData = this.loginForm.value;

      this.authService.login(formData).subscribe(response => {

      if(response.success){

        localStorage.setItem('loggedInUser', JSON.stringify(response.user))
        
         Swal.fire({
    title: 'Welcome!',
    text: 'You are logged in',
    icon: 'success',
    background: '#121212',           // Dark background
    color: '#fff',                   // White text
    iconColor: '#ff66c4',            // Pink icon
    confirmButtonColor: '#ff66c4',   // Pink confirm button
    customClass: {
      popup: 'border-radius',
      title: 'swal-title',
      confirmButton: 'swal-button'
    }
  });
          this.loginForm.reset()
          this.router.navigate(['/dashboard'])
        }
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
    
      })
  }

}
}
