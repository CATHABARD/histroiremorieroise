import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { ANALYZE_FOR_ENTRY_COMPONENTS, Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Observable, Observer, Subscriber, Subscription } from 'rxjs';
import { map, shareReplay, take } from 'rxjs/operators';
import { SignInComponent } from '../auth/sign-in/sign-in.component';
import { SignUpComponent } from '../auth/sign-up/sign-up.component';
import { Article } from '../modeles/article';
import { User } from '../modeles/user';
import { AuthService } from '../services/auth.service';
import { GlobalService, Status } from '../services/global.service';
import * as firebase from 'firebase/app';
import "firebase/auth";
import { Theme } from '../modeles/themes';

@Component({
  selector: 'app-frame',
  templateUrl: './frame.component.html',
  styleUrls: ['./frame.component.css']
})
export class FrameComponent implements OnInit, OnDestroy {
  dialogResultSuscription: Subscription | undefined;

  userMail: string = 'Visiteur';
  userPassword: string = '';
  isAdmin = false;
  isAuth = false;
  showFiller = false;
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Small)
  .pipe(
    map((result: BreakpointState) => result.matches)
  );

  private userSubscription: Subscription;

  constructor(private router: Router,
              public dialog: MatDialog,
              private breakpointObserver: BreakpointObserver,
              public globalService: GlobalService,
              public authService: AuthService) {
                this.userSubscription = this.authService.authSubject.pipe(shareReplay(1)).subscribe(u => {
                  if (u != null) {
                    if( u.email != authService.getVisiteur()) {
                      this.userMail = u?.email!;
                      this.isAuth = true;
                    } else {
                      this.userMail = 'visiteur';
                      this.isAuth = false;
                    }
                  } else {
                    this.userMail = 'visiteur';
                    this.isAuth = false;
                  }
                })
              }

  ngOnInit() {
  }

  ngOnDestroy() {
    if( this.userSubscription != null) {
      this.userSubscription.unsubscribe();
    }
  }

  onGoAccueil() {
    this.router.navigate(['app-acceuil']);
  }

  onClickAlbum(deb: number, fin: number) {

  }

  onMessage() {

  }

  onOpenPdf() {
    this.router.navigate(['app-liste-pdf']);
  }

  onListeArticles(t: Theme) {
    this.router.navigate(['app-liste-articles']);
  }

  onEditAlbum(deb: number, fin: number) {
    this.router.navigate(['app-album'], {
      queryParams: {debut: deb, fin: fin}
    });
}

  onEditArticle(a: Article) {
    
  }

  onNewCompteDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '500px';

    const dialogRef = this.dialog.open(SignUpComponent);

    if (this.dialogResultSuscription) {
      this.dialogResultSuscription.unsubscribe();
    }

    this.dialogResultSuscription =  dialogRef.afterClosed().subscribe(data => {
      if (data !== undefined) {
        const user = new User('', '', data.nom, data.prenom, data.email, false, Status.initial);
        this.authService.createNewUser(user, data.password1);
      }
    },
    (error) => {
      console.log(error);
    });
  }

  onConnectWidthGoogleDialog() {
    this.authService.connectWidthGoogle().pipe(take(1));
  }

  onConnectDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '400px';
    dialogConfig.data = {email: this.userMail, password: this.userPassword };

    const dialogRef = this.dialog.open(SignInComponent, dialogConfig);

    if (this.dialogResultSuscription) {
      this.dialogResultSuscription.unsubscribe();
    }

    this.dialogResultSuscription =  dialogRef.afterClosed().subscribe(data => {
      if (data !== undefined && data.email !== undefined && data.password !== undefined ) {
        this.authService.signInUser(data.email, data.password).finally(() => {
        });
      }
    },
    (error) => {
      console.log(error);
    });
  }

  onDisconnectDialog() {
    this.authService.signInVisiteur().finally(() => {
      this.router.navigate(['app-sign-in']);
    });
  }
  
  onAdmin() {

  }
}
