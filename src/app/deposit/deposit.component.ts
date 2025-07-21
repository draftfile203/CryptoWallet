import { Component } from '@angular/core';
import { Router, RouterModule} from '@angular/router';

@Component({
  selector: 'app-deposit',
  imports: [RouterModule],
  templateUrl: './deposit.component.html',
  styleUrl: './deposit.component.css'
})
export class DepositComponent {

  constructor(private router: Router) {}

  // Logs the user out by clearing localStorage and navigating to main page
  logout(): void {
    localStorage.removeItem('loggedInUser');
    localStorage.removeItem('RegisteredUser');
    this.router.navigate(['/main']);
  }

  // Copies the inner text of the given HTML element to the clipboard
  copyText(element: HTMLElement): void {
    const text = element.innerText || element.textContent || '';
    navigator.clipboard.writeText(text).then(() => {
      console.log('Text copied to clipboard');
      // Optionally display a visual confirmation here (e.g., toast message)
    }).catch(err => {
      console.error('Failed to copy text: ', err);
    });
  }
}