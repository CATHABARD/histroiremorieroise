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

  getUserByUid(uid: string) {
    return this.afStore.collection('/Users', u => u.where('uid', '==', uid)).snapshotChanges(); 
  }

  addUser(user: User) {
    return this.afStore.collection('Users').add({
      nom: user.nom,
      prenom: user.prenom,
      email: user.email,
      emailVerified: user.emailVerified,
      uid: user.uid,
      status: user.status
    });
  }
}
