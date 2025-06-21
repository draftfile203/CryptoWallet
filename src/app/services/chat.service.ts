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

  sendMessage(text: string, sender: 'user' | 'admin', userId: string) {
    const messagesRef = collection(this.firestore, 'messages');
    return addDoc(messagesRef, {
      text,
      createdAt: new Date(),
      sender,
      userId
    });
  }

  getMessages(userId: string): Observable<any[]> {
    const messagesRef = collection(this.firestore, 'messages');
    const q = query(
      messagesRef,
      where('userId', '==', userId),
      orderBy('createdAt')
    );
    return collectionData(q, { idField: 'id' });
  }

  getAllMessages(): Observable<any[]> {
    const messagesRef = collection(this.firestore, 'messages');
    const q = query(messagesRef, orderBy('createdAt'));
    return collectionData(q, { idField: 'id' });
  }
}
