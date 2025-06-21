import { Component } from '@angular/core';
import { Router, RouterModule} from '@angular/router';

@Component({
  selector: 'app-deposit',
  imports: [RouterModule],
  templateUrl: './deposit.component.html',
  styleUrl: './deposit.component.css'
})
export class DepositComponent {

  copyText(element: HTMLElement): void {
  const text = element.innerText || element.textContent || '';
  navigator.clipboard.writeText(text).then(() => {
    console.log('Text copied to clipboard');
    // Optionally show a toast or temporary success message
  }).catch(err => {
    console.error('Failed to copy text: ', err);
  });
}


  constructor(private router: Router) {}

 logout(): void {
    localStorage.removeItem('loggedInUser');
    localStorage.removeItem('RegisteredUser');
    this.router.navigate(['/main']);
  }
}
