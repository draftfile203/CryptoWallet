import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  AfterViewInit,
  Inject,
  PLATFORM_ID
} from '@angular/core';
import { ChatService } from '../services/chat.service';
import { Observable, Subscription, of } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { CommonModule, isPlatformBrowser, NgClass, NgFor, NgIf } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin-chat',
  templateUrl: './admin-chat.component.html',
  styleUrls: ['./admin-chat.component.css'],
  standalone: true,
  imports: [FormsModule, NgFor, NgIf, NgClass, CommonModule, RouterModule]
})
export class AdminChatComponent implements OnInit, OnDestroy, AfterViewInit {
  users: string[] = []; // List of unique users who sent messages
  selectedUserId: string | null = null; // Currently selected user
  messages$: Observable<any[]> = of([]); // Observable for messages to display
  message = ''; // Message input by admin
  unreadCounts: { [userId: string]: number } = {}; // Unread message count per user
  allMessages: any[] = []; // All messages from the server
  private messageSub: Subscription | null = null; // Subscription for message stream
  private lastSeenTimestamps: { [userId: string]: Date } = {}; // Track last seen timestamps

  @ViewChild('messageList') messageList!: ElementRef; // Reference to the message list DOM element

  constructor(private chatService: ChatService, @Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.loadLastSeenTimestamps();

      // Subscribe to all messages from the server
      this.messageSub = this.chatService.getAllMessages().subscribe(messages => {
        this.allMessages = messages;
        this.users = this.extractUniqueUsers(messages);

        // Automatically select the first user if none selected
        if (!this.selectedUserId && this.users.length > 0) {
          this.selectUser(this.users[0]);
        }

        // Recalculate unread counts after messages load
        setTimeout(() => {
          this.calculateUnreadCounts();
        });
      });
    }
  }

  ngAfterViewInit(): void {}

  ngOnDestroy() {
    this.messageSub?.unsubscribe(); // Unsubscribe to avoid memory leaks
  }

  // Select a user and load their messages
  selectUser(userId: string) {
    this.selectedUserId = userId;
    this.setLastSeen(userId, new Date());
    this.unreadCounts[userId] = 0;
    this.loadMessages(userId);
    this.calculateUnreadCounts();
  }

  // Send message from admin to selected user
  send() {
    if (this.message.trim() && this.selectedUserId) {
      this.chatService.sendMessage(this.message, 'admin', this.selectedUserId);
      this.message = '';
      setTimeout(() => this.scrollToBottom(), 100);
    }
  }

  // Load messages for a specific user
  private loadMessages(userId: string): void {
    this.messages$ = this.chatService.getMessages(userId);
    this.messages$.subscribe(() => {
      setTimeout(() => this.scrollToBottom(), 100);
    });
  }

  // Scroll message view to the bottom
  private scrollToBottom(): void {
    try {
      this.messageList.nativeElement.scrollTop = this.messageList.nativeElement.scrollHeight;
    } catch (err) {
      console.warn('Scroll failed', err);
    }
  }

  trackByUser(index: number, userId: string) {
    return userId;
  }

  // --- Last seen logic ---

  private loadLastSeenTimestamps(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      const raw = localStorage.getItem('adminLastSeenTimestamps');
      if (raw) {
        try {
          const parsed = JSON.parse(raw);
          for (const userId of Object.keys(parsed)) {
            parsed[userId] = new Date(parsed[userId]);
          }
          this.lastSeenTimestamps = parsed;
        } catch {
          this.lastSeenTimestamps = {};
        }
      }
    }
  }

  private saveLastSeenTimestamps(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('adminLastSeenTimestamps', JSON.stringify(this.lastSeenTimestamps));
    }
  }

  private getLastSeen(userId: string): Date | null {
    return this.lastSeenTimestamps[userId] || null;
  }

  private setLastSeen(userId: string, date: Date): void {
    this.lastSeenTimestamps[userId] = date;
    this.saveLastSeenTimestamps();
  }

  // Get unique list of users who sent messages
  private extractUniqueUsers(messages: any[]): string[] {
    const seen = new Set<string>();
    const ordered: string[] = [];

    messages.forEach(msg => {
      if (msg.sender === 'user' && msg.userId && !seen.has(msg.userId)) {
        seen.add(msg.userId);
        ordered.push(msg.userId);
      }
    });

    return ordered;
  }

  // Count how many unread messages exist for each user
  private calculateUnreadCounts(): void {
    this.unreadCounts = {};
    this.users.forEach(userId => {
      const lastSeen = this.getLastSeen(userId);

      const unreadCount = this.allMessages.filter(msg => {
        const isFromUser = msg.sender === 'user';
        const belongsToUser = msg.userId === userId;
        const msgDate = msg.createdAt?.toDate?.();
        const isUnread = !lastSeen || (msgDate && msgDate > lastSeen);
        return isFromUser && belongsToUser && isUnread;
      }).length;

      const isNotCurrentlySelected = this.selectedUserId !== userId;
      this.unreadCounts[userId] = isNotCurrentlySelected ? unreadCount : 0;
    });
  }
}