import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import Swal from 'sweetalert2';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-register',
  imports: [RouterModule,ReactiveFormsModule,NgIf],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  registerForm: FormGroup
  
  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required,Validators.email]],
      password: ['', [Validators.required,Validators.minLength(6)]],
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      personnumber: ['', Validators.required]
      });
  }

  onSubmit() {
    if(this.registerForm.valid) {
      const formData = this.registerForm.value
      this.authService.register(formData).subscribe(response => {
        localStorage.setItem('RegisteredUser',JSON.stringify(formData))

        console.log('user registered:', formData)
      })

      Swal.fire({
    title: "SUCCESS",
    text: "You are registered",
    icon: "success",
    background: "#121212",            // dark background
    color: "#fff",                    // white text
    iconColor: "#ff66c4",            // pink icon
    confirmButtonColor: "#ff66c4",   // pink confirm button
    customClass: {
      popup: 'border-radius',
      title: 'swal-title',
      confirmButton: 'swal-button'
    }
  });

      this.registerForm.reset()
      this.router.navigate(['/login'])
    }  else {
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
