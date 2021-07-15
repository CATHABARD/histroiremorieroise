import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../modeles/user';
import { MatDialog } from '@angular/material/dialog';
import { from, Subject } from 'rxjs';
import { Droits, Status } from './global.service';
import * as firebase from 'firebase/app';
import "firebase/auth";
import "firebase/firestore";
import { AngularFirestore } from '@angular/fire/firestore';
import { UsersServicesService } from './users-services.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly visiteur = {email: 'histoiredemorieres@gmail.com',
                      password: '@HDM2021'}

  userId: string = '';
  private currentFirebaseUser: firebase.default.auth.UserCredential | undefined;
  private currentUser: User | undefined | null;
  private status: number | undefined;

  authSubject = new Subject<User>();

  constructor(public dialog: MatDialog,
              public router: Router,
              public ngZone: NgZone,
              private afs: AngularFirestore,
              private usersService: UsersServicesService) {
                this.status = 0;
  }

  private emitUserChanged() {
    this.authSubject.next(this.currentUser!);
  }

  getVisiteur() {
    return this.visiteur.email;
  }

  getCurrentFirebaseUser() {
    return this.currentFirebaseUser;
  }      
      
  getCurrentUser() {
    return this.currentUser;
  }      

  getStatus() {
    return this.status;
  }
      
  signInVisiteur() {
    return new Promise((resolve, reject) => {
        firebase.default.auth().signOut().then(() => {
        // Ouvrir la connexion visiteur
        firebase.default.auth().signInWithEmailAndPassword(this.visiteur.email, this.visiteur.password).then(u => {
          this.status = 0;
          this.currentUser = new User('', u.user?.uid, 'Visiteur', 'Visiteur', u.user?.email?.trim(), true, Status.valide );
          this.currentFirebaseUser = u;
        }).catch(error => {
          console.log(error);
          reject(error);
        }).finally(() => {
          this.emitUserChanged();
          resolve(this.currentFirebaseUser);
        })
      })
    })
  }

  createNewUser(user: User, password: string) {
  return new Promise(
    (resolve) => {
      firebase.default.auth().createUserWithEmailAndPassword(user!.email!.trim(), password.trim()).then((u: firebase.default.auth.UserCredential) => {
          u.user!.updateProfile({displayName: user.nom + '/' + user.prenom});
          user.uid = u.user!.uid;
          u.user!.sendEmailVerification().then(() => {
            alert('Un email vous a été envoyé, merci de cliquer sur le lien qu\'il contien afin de valider vôtre inscription.');
          }).catch((error: any) => {
              console.log(error);
            });
            firebase.default.auth().signInWithEmailAndPassword(this.visiteur.email, this.visiteur.password).then(u => {
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
    firebase.default.auth().onAuthStateChanged(U => U?.updateProfile({displayName: u.nom + '/' + u.prenom}));
  }

  signInUser(email: string, password: string) {
    let USER: User;
    let U: User;
    let X: User;

    return new Promise((resolve, reject) => {
      firebase.default.auth().signOut().then(() => {
        // ouverture de la nouvelle connexion
        firebase.default.auth().signInWithEmailAndPassword(email, password).then(user => {
          // console.log(user.user);
          // Vérifier si le mail a bien été validé
          if (user.user!.emailVerified) {
            // mail validé
            USER = new User('', user.user?.uid, user.user!.displayName!.substring(0, user.user!.displayName!.indexOf('/')),
            user.user!.displayName!.substring(user.user!.displayName!.indexOf('/') + 1),
            user.user!.email?.toString(),
            true, Droits.visiteur);
            this.currentFirebaseUser = user;
          } else { // mail non vérifié
            this.router.navigate(['app-unvalidate-user-message']);
          }
        }).catch(error => {
          console.log(error.message);
          alert('Erreur de connexion, mail ou mot de passe incorrect ?');
          reject(error);
        }).finally(() => {
          // Rechercher si user est dans la BD
            this.usersService.getUserByUid(this.currentFirebaseUser?.user?.uid.trim() as string).subscribe(u => {
              if (u.length <= 0) {
                this.usersService.addUser(USER);
              } else {
                u.forEach(U => {
                  X = U.payload.doc.data() as User;
                  if (u.length <= 0) {
                    this.usersService.addUser(USER);
                  } else {
                    this.currentUser = U.payload.doc.data() as User;
                    this.currentUser.id = U.payload.doc.id;
                    this.status = this.currentUser.status;
                    this.emitUserChanged();
                    resolve(this.currentFirebaseUser);
                  }
                })
              }
            },
            (error) => {
              console.log(error.message);
            });
        });
      })
    });
  }

  SignOut() {
    this.currentUser = undefined;
    this.currentFirebaseUser = undefined;
    return new Promise((resolve, reject) => {
      firebase.default.auth().signOut().finally(() => {
        resolve('utilisateur déconnecté.');
      }).catch((error: any) => {
        console.log(error);
        reject(error);
      });
    });
  }  

  sendMailNewUser() {
    console.log('Send mail : ' + this.currentFirebaseUser?.user?.email);
    this.currentFirebaseUser?.user?.sendEmailVerification();
  }

  getCurrentAuthUser() {
    return firebase.default.auth().currentUser;
  }

  ForgotPassword(Email: string) {
    return firebase.default.auth().sendPasswordResetEmail(Email).then(() => {
      alert('Un email de réinitialisation du mot de passe vous a été envoyé, vérifiez votre boîte de réception.');
    }).catch((error) => {
      alert('Erreur de connexion, avez-vous bien saisi l\'adresse ?.');
      console.log(error);
    });
  }

  connectWidthGoogle() {
    return from(firebase.default.auth().signInWithPopup(new firebase.default.auth.GoogleAuthProvider()));

    /*
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
      }); */
  }

  getUserFromDB(user: firebase.default.User) {
    return this.afs.collection('Users', ref => ref.where('uid', '==', user.uid)).snapshotChanges();
  }
}
