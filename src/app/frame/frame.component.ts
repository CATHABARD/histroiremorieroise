import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { SignInComponent } from '../auth/sign-in/sign-in.component';
import { SignUpComponent } from '../auth/sign-up/sign-up.component';
import { Article } from '../modeles/article';
import { AuthService } from '../services/auth.service';
import { GlobalService } from '../services/global.service';

@Component({
  selector: 'app-frame',
  templateUrl: './frame.component.html',
  styleUrls: ['./frame.component.css']
})
export class FrameComponent implements OnInit {
  dialogResultSuscription: Subscription | undefined;

  userMail: string = '';
  userPassword: string = '';
  isAdmin = false;
  showFiller = false;
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Small)
  .pipe(
    map((result: BreakpointState) => result.matches)
  );

  constructor(private router: Router,
              public dialog: MatDialog,
              private breakpointObserver: BreakpointObserver,
              public globalService: GlobalService,
              private authService: AuthService) { }

  ngOnInit(): void {
  }

  onGoAccueil() {
    this.router.navigate(['app-acceuil']);
  }

  onClickAlbum(deb: number, fin: number) {

  }

  onMessage() {

  }

  onOpenPdf() {

  }

  onEditAlbum(deb: number, fin: number) {
    
  }

  onEditArticle(a: Article) {

  }

  onNewCompteDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '500px';

    const dialogRef = this.dialog.open(SignUpComponent);

  }

  onConnectWidthGoogleDialog() {
    this.authService.connectWidthGoogle();
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
        this.authService.signInUser(data.email, data.password);
      }
    },
    (error) => {
      console.log(error);
    });
  }

  onDisconnectDialog() {
      this.authService.signInUser('claude.cathabard@gmail.com', 'MyPepita51').then(() => {
      this.router.navigate(['app-home']);
    });
  }
  
  onAdmin() {

  }
}
