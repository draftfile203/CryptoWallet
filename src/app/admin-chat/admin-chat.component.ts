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
  users: string[] = [];
  selectedUserId: string | null = null;
  messages$: Observable<any[]> = of([]);
  message = '';
  unreadCounts: { [userId: string]: number } = {};
  allMessages: any[] = [];
  private messageSub: Subscription | null = null;
  private lastSeenTimestamps: { [userId: string]: Date } = {};

  @ViewChild('messageList') messageList!: ElementRef;

  constructor(private chatService: ChatService, @Inject(PLATFORM_ID) private platformId: Object) {}
ngOnInit(): void {
  if (isPlatformBrowser(this.platformId)) {
    this.loadLastSeenTimestamps();

    this.messageSub = this.chatService.getAllMessages().subscribe(messages => {
      this.allMessages = messages;
      this.users = this.extractUniqueUsers(messages);

      if (!this.selectedUserId && this.users.length > 0) {
        this.selectUser(this.users[0]);
      }

      setTimeout(() => {
        this.calculateUnreadCounts();
      });
    });
  }
}

  ngAfterViewInit(): void {}

  ngOnDestroy() {
    this.messageSub?.unsubscribe();
  }

  selectUser(userId: string) {
    this.selectedUserId = userId;
    this.setLastSeen(userId, new Date());
    this.unreadCounts[userId] = 0;
    this.loadMessages(userId);
    this.calculateUnreadCounts(); // recalculate after selection
  }

  send() {
    if (this.message.trim() && this.selectedUserId) {
      this.chatService.sendMessage(this.message, 'admin', this.selectedUserId);
      this.message = '';
      setTimeout(() => this.scrollToBottom(), 100);
    }
  }

  private loadMessages(userId: string): void {
    this.messages$ = this.chatService.getMessages(userId);
    this.messages$.subscribe(() => {
      setTimeout(() => this.scrollToBottom(), 100);
    });
  }

  private scrollToBottom(): void {
    try {
      this.messageList.nativeElement.scrollTop =
        this.messageList.nativeElement.scrollHeight;
    } catch (err) {
      console.warn('Scroll failed', err);
    }
  }

  trackByUser(index: number, userId: string) {
    return userId;
  }

  // --- Last seen tracking ---
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
