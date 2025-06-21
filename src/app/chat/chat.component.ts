import { Component, OnInit, Inject, PLATFORM_ID, ViewChild, ElementRef } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { ChatService } from '../services/chat.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule,RouterModule],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  @ViewChild('messagesContainer') messagesContainer!: ElementRef

  message = '';
  messages$: Observable<any[]> = of([]);
  userId = '';
  isAdmin = false;
  hasSentFirstMessage = false;
  isLoggedIn = false

  constructor(
    private chatService: ChatService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router
  ) {}

  ngOnInit() {

      this.checkLoginStatus()

    if (isPlatformBrowser(this.platformId)) {
      let id = localStorage.getItem('chatUserId');
      if (!id) {
        id = crypto.randomUUID();
        localStorage.setItem('chatUserId', id);
      }
      this.userId = id;

      this.messages$ = this.chatService.getMessages(this.userId);
      this.messages$.subscribe(() => {
      setTimeout(() => this.scrollToBottom(), 100);
    });
    }
  }
  
checkLoginStatus() { 
  if (isPlatformBrowser(this.platformId)) {
    this.isLoggedIn = !!localStorage.getItem('loggedInUser');
  } else {
    this.isLoggedIn = false;
  }
}



  send() {
  if (!this.userId) return;

  if (this.message.trim()) {
    this.chatService.sendMessage(this.message, 'user', this.userId);

    const alreadyWelcomed = localStorage.getItem('hasSentFirstMessage');

    if (!alreadyWelcomed) {
      localStorage.setItem('hasSentFirstMessage', 'true');
      setTimeout(() => {
        this.chatService.sendMessage(
          "Hello, our agent will be in touch in short.",
          'admin',
          this.userId
        );
      }, 500);
    }

    this.message = '';
  }
}

scrollToBottom() {
  try {
    this.messagesContainer.nativeElement.scrollTop =
      this.messagesContainer.nativeElement.scrollHeight;
  } catch (err) {
    console.error('Failed to scroll:', err);
  }
}


  logout() {
    localStorage.removeItem('loggedInUser');
    this.isLoggedIn = false;
    this.router.navigate(['/main']);
  }


}
