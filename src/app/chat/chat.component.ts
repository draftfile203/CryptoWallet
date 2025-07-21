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

  // Reference to the messages container for scrolling
  @ViewChild('messagesContainer') messagesContainer!: ElementRef;

  // User input message
  message = '';

  // Observable stream of messages
  messages$: Observable<any[]> = of([]);

  // Unique identifier for the user
  userId = '';

  // Whether the current user is an admin
  isAdmin = false;

  // Tracks if welcome message has already been sent
  hasSentFirstMessage = false;

  // Whether the user is logged in
  isLoggedIn = false;

  constructor(
    private chatService: ChatService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router
  ) {}

  ngOnInit() {
    this.checkLoginStatus();

    if (isPlatformBrowser(this.platformId)) {
      // Retrieve or generate a unique ID for the chat user
      let id = localStorage.getItem('chatUserId');
      if (!id) {
        id = crypto.randomUUID();
        localStorage.setItem('chatUserId', id);
      }
      this.userId = id;

      // Load messages for the user
      this.messages$ = this.chatService.getMessages(this.userId);

      // Scroll to bottom when messages load
      this.messages$.subscribe(() => {
        setTimeout(() => this.scrollToBottom(), 100);
      });
    }
  }

  // Check if user is logged in
  checkLoginStatus() {
    if (isPlatformBrowser(this.platformId)) {
      this.isLoggedIn = !!localStorage.getItem('loggedInUser');
    } else {
      this.isLoggedIn = false;
    }
  }

  // Send a message from the user
  send() {
    if (!this.userId) return;

    if (this.message.trim()) {
      // Send user's message
      this.chatService.sendMessage(this.message, 'user', this.userId);

      // Auto-send admin welcome message once
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

      // Clear input field
      this.message = '';
    }
  }

  // Scroll chat view to bottom
  scrollToBottom() {
    try {
      this.messagesContainer.nativeElement.scrollTop =
        this.messagesContainer.nativeElement.scrollHeight;
    } catch (err) {
      console.error('Failed to scroll:', err);
    }
  }

  // Log the user out and redirect to main page
  logout() {
    localStorage.removeItem('loggedInUser');
    this.isLoggedIn = false;
    this.router.navigate(['/main']);
  }

}