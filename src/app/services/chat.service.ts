import {
  Firestore,
  collection,
  addDoc,
  collectionData,
  query,
  orderBy,
  where,
} from '@angular/fire/firestore';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ChatService {
  constructor(private firestore: Firestore) {}

  // Sends a message to Firestore
  sendMessage(text: string, sender: 'user' | 'admin', userId: string) {
    const messagesRef = collection(this.firestore, 'messages');
    return addDoc(messagesRef, {
      text,
      createdAt: new Date(),
      sender,
      userId
    });
  }

  // Retrieves messages for a specific user
  getMessages(userId: string): Observable<any[]> {
    const messagesRef = collection(this.firestore, 'messages');
    const q = query(
      messagesRef,
      where('userId', '==', userId),
      orderBy('createdAt')
    );
    return collectionData(q, { idField: 'id' });
  }

  // Retrieves all messages from Firestore
  getAllMessages(): Observable<any[]> {
    const messagesRef = collection(this.firestore, 'messages');
    const q = query(messagesRef, orderBy('createdAt'));
    return collectionData(q, { idField: 'id' });
  }
}