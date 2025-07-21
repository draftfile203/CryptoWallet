import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, of } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AdminService {
  constructor(private http: HttpClient) {}

  // Fetches a user by email from both people1 and people2
  getUserByEmail(email: string): Observable<any> {
    const apiA = this.http.get<any[]>(`https://68482513ec44b9f3493fcb34.mockapi.io/people1?email=${email}`)
      .pipe(catchError(() => of([])));

    const apiB = this.http.get<any[]>(`https://68482513ec44b9f3493fcb34.mockapi.io/people2?email=${email}`)
      .pipe(catchError(() => of([])));

    return forkJoin([apiA, apiB]).pipe(
      map(([resA, resB]) => {
        if (resA.length > 0) {
          return { ...resA[0], source: 'A' };
        } else if (resB.length > 0) {
          return { ...resB[0], source: 'B' };
        } else {
          return null;
        }
      })
    );
  }

  // Updates a user in the correct API based on source
  updateUser(user: any): Observable<any> {
    const apiUrl = user.source === 'A'
      ? `https://68482513ec44b9f3493fcb34.mockapi.io/people1/${user.id}`
      : `https://68482513ec44b9f3493fcb34.mockapi.io/people2/${user.id}`;

    return this.http.put(apiUrl, user);
  }

  // Deletes all users from both people1 and people2
  deleteAllUsers(): Observable<any> {
    const apiAUrl = 'https://68482513ec44b9f3493fcb34.mockapi.io/people1';
    const apiBUrl = 'https://68482513ec44b9f3493fcb34.mockapi.io/people2';

    const getPeopleA$ = this.http.get<any[]>(apiAUrl).pipe(catchError(() => of([])));
    const getPeopleB$ = this.http.get<any[]>(apiBUrl).pipe(catchError(() => of([])));

    return forkJoin([getPeopleA$, getPeopleB$]).pipe(
      switchMap(([peopleA, peopleB]) => {
        const deleteRequests = [
          ...peopleA.map(user => this.http.delete(`${apiAUrl}/${user.id}`)),
          ...peopleB.map(user => this.http.delete(`${apiBUrl}/${user.id}`))
        ];
        return forkJoin(deleteRequests);
      })
    );
  }
}