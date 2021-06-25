import { Injectable, NgZone, OnDestroy, ɵConsole } from '@angular/core';
import auth from 'firebase/app';
import { Router } from '@angular/router';
import { User } from '../modeles/user';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Observable, Subject } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import { Droits } from './global.service';
import { UsersServicesService } from './users-services.service';
import { AngularFirestore, DocumentChangeAction } from '@angular/fire/firestore';
import { UserDatasComponent } from '../auth/user-datas/user-datas.component';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private visiteur = {email: 'claude.cathabard@gmail.com',
                      password: 'HDM2021'};

  userId: string = '';
  private currentFirebaseUser: firebase.default.auth.UserCredential | undefined;
  private currentUser: User | undefined | null;
  user$: Observable<auth.User | null>;
  authSubject = new Subject<boolean>();

  constructor(public dialog: MatDialog,
              public router: Router,
              private afAuth: AngularFireAuth,
              private afStore: AngularFirestore,
              public ngZone: NgZone,
              private usersServices: UsersServicesService
          ) {
            this.user$ = this.afAuth.authState;
          }

  getCurrentFirebaseUser() {
    return this.currentFirebaseUser;
  }      
      
  getCurrentUser() {
    return this.currentUser;
  }      
      
  signInVisiteur() {
  return new Promise(
    (resolve) => {
      resolve(this.afAuth.signInWithEmailAndPassword(this.visiteur.email, this.visiteur.password).then((u) => {
        this.currentFirebaseUser = u;
      }).catch(error => {
        console.log(error);
      }));
    });
  }

  createNewUser(user: User, password: string) {
  return new Promise(
    (resolve) => {
      this.afAuth.createUserWithEmailAndPassword(user!.email!.trim(), password.trim()).then((u: firebase.default.auth.UserCredential) => {
          u.user!.updateProfile({displayName: user.nom + '/' + user.prenom});
          u.user!.sendEmailVerification().then(result => {
              user.uid = u.user!.uid;
            }).catch((error: any) => {
              console.log(error);
            });
          this.afAuth.signInWithEmailAndPassword(this.visiteur.email, this.visiteur.password).then(u => {
            this.currentFirebaseUser = u;
          });
          this.router.navigate(['app-accueil']);
          resolve(true);
        }
      );
    }
  );
}

  updateCurrentUser(u: User) {
    this.afAuth.currentUser.then(U => U?.updateProfile({displayName: u.nom + '/' + u.prenom}));
  }

  signInUser(email: string, password: string) {
    if (email === this.visiteur.email) {
      this.afAuth.signInWithEmailAndPassword(email, password).then(
        (user) => {
          if (this.currentUser == null) {
            this.currentUser = new User();
          }
          if(this.currentUser !== undefined) {
            this.currentUser.email = '';
            this.currentUser.emailVerified = true;
            this.currentUser.uid = user.user!.uid;
            this.currentUser.nom = '';
            this.currentUser.prenom = 'Visiteur';
            this.currentUser.status = Droits.visiteur;
          }
          this.usersServices.getUser(user.user!.uid.toString()).subscribe(u => {
            this.currentUser = u.payload.data as User;
          });
      },
      (error: any) => {
        console.log(error);
      });
    }
    return new Promise(
      (resolve, reject) => {
      // Identification firebase
      this.afAuth.signInWithEmailAndPassword(email, password).then(
        (user) => {
          if (this.currentUser == null) {
            this.currentUser = new User();
          }
          this.currentFirebaseUser = user;
          // Vérifier si le mail a bien été validé
          if (user.user!.emailVerified) {
            // mail validé
            if(this.currentUser !== undefined) {
              this.currentUser.email = user.user!.email?.toString();
              this.currentUser.emailVerified = true;
              this.currentUser.uid = user.user!.uid.toString();
              this.currentUser.nom = user.user!.displayName!.substring(0, user.user!.displayName!.indexOf('/'));
              this.currentUser.prenom = user.user!.displayName!.substring(user.user!.displayName!.indexOf('/') + 1);
              this.currentUser.status = Droits.visiteur;
            }
            // Rechercher si user est dans la BD
            this.usersServices.getUser(user.user!.uid.toString()).subscribe(u => {
              this.currentUser = u.payload.data as User;
            });
          } else { // mail non vérifié
            this.currentFirebaseUser = user;
            this.router.navigate(['app-unvalidate-user-message']);
          }
          resolve(true);
        },
        (error: any) => {
          console.log(error);
          alert('Erreur de connexion, adresse mail ou mot de passe incorrect ?');
          reject(error);
        });
      }
    );
  }

  sendMailNewUser() {
    console.log('Send mail');
    this.currentFirebaseUser?.user?.sendEmailVerification();
  }

  /*
  getCurrentAuthUser() {
    return auth().currentUser;
  }
  */

  ForgotPassword(passwordResetEmail: string) {
    console.log(passwordResetEmail);
    return this.afAuth.sendPasswordResetEmail(passwordResetEmail).then(() => {
      alert('Un email de réinitialisation du mot de passe vous a été envoyé, vérifiez votre boîte de réception.');
    }).catch((error) => {
      console.log(error);
    });
  }

  connectWidthGoogle() {
    const provider = new auth.auth.GoogleAuthProvider();
    let data = [];
    return this.afAuth.signInWithPopup(provider).then(
      (user) => {
        if (this.currentUser == null) {
          this.currentUser = new User();
        }
        // Vérifier si le mail a bien été validé
        if (user.user?.emailVerified) {
          // mail validé
          this.currentUser.email = user.user.email?.toString();
          this.currentUser.emailVerified = true;
          this.currentUser.uid = user.user.uid;
          this.currentUser.nom = user.user.displayName?.substring(0, user.user.displayName?.indexOf('/'));
          this.currentUser.prenom = user.user.displayName?.substring(user.user.displayName?.indexOf('/') + 1);
          this.currentUser.status = Droits.visiteur;
          // Rechercher si user est dans la BD
          this.getUserFromDB(user.user).subscribe(u => {
            data = u.map(U => {
              const d = U.payload.doc.data() as User;
              d.id = U.payload.doc.id;
              return d;
            });
            // Ouverture de la dialogbox pour obtenir le nom et le prénom
            if (data.length === 0) {
              const dialogConfig = new MatDialogConfig();
              dialogConfig.disableClose = true;
              dialogConfig.autoFocus = true;
              dialogConfig.width = '500px';
              dialogConfig.data = {email: this.currentUser?.email };

              const dialogRef = this.dialog.open(UserDatasComponent, dialogConfig);

              dialogRef.afterClosed().subscribe(d => {
                this.currentUser!.nom = d.nom;
                this.currentUser!.prenom = d.prenom;
                this.addCurrentUserFromDB();
              });
             } else {
              this.currentUser = data[0];
            }
          });
        } else { // mail non vérifié
          this.currentFirebaseUser = user;
          this.router.navigate(['app-unvalidate-user-message']);
        }
      },
      (error: any) => {
        console.log(error);
        alert('Erreur de connexion, adresse mail ou mot de passe incorrect ?');
      });
  }

  getUserFromDB(user: firebase.default.User): Observable<DocumentChangeAction<unknown>[]>{
    return this.afStore.collection('Users', u => u.where('uid', '==', user.uid)).snapshotChanges();
  }

  addCurrentUserFromDB() {
    return this.afStore.collection('Users').add({

    });
  }
}
