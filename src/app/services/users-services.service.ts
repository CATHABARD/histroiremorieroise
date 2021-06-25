import { Injectable } from '@angular/core';
import { Action, AngularFirestore, DocumentSnapshot } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { User } from '../modeles/user';

@Injectable({
  providedIn: 'root'
})
export class UsersServicesService {

  constructor(private afStore: AngularFirestore) { }

  getUser(id: string): Observable<Action<DocumentSnapshot<unknown>>> {
      return this.afStore.collection('/Users').doc(id).snapshotChanges(); 
  }

  addUser(u: User) {
    
  }
}
