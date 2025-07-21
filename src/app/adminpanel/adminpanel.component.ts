import { Component, NgModule } from '@angular/core';
import { AdminService } from '../services/admin-service.service';
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-adminpanel',
  imports: [NgIf,FormsModule],
  templateUrl: './adminpanel.component.html',
  styleUrl: './adminpanel.component.css'
})
export class AdminpanelComponent {

  // Holds the input value for email search
  searchEmail: string = '';

  // Holds the retrieved user object if found
  userFound: any = null;

  constructor(private adminService: AdminService) {}

  // Search for a user by email
  searchUser() {
    this.adminService.getUserByEmail(this.searchEmail).subscribe(user => {
      this.userFound = user;
    });
  }

  // Update the current user (after editing in UI)
  updateUser() {
    this.adminService.updateUser(this.userFound).subscribe(updated => {
      alert('User updated successfully!');
      // Save the updated user in localStorage
      localStorage.setItem('loggedInUser', JSON.stringify(updated));
    });
  }

  // Delete all users with confirmation using SweetAlert2
  deleteAllUsers(): void {
    Swal.fire({
      title: 'Delete ALL users?',
      text: 'This will remove ALL users from both people and people2!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#999',
      confirmButtonText: 'Yes, delete all'
    }).then((result) => {
      if (result.isConfirmed) {
        this.adminService.deleteAllUsers().subscribe(() => {
          Swal.fire('Deleted!', 'All users were removed.', 'success');
        });
      }
    });
  }

}