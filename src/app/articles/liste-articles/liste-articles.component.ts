import { Component, OnInit, OnDestroy } from '@angular/core';
import { GlobalService, Droits } from 'src/app/services/global.service';
import { Article } from '../../modeles/article';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth.service';
import * as firebase from 'firebase';

@Component({
  selector: 'app-liste-articles',
  templateUrl: './liste-articles.component.html',
  styleUrls: ['./liste-articles.component.css']
})
export class ListeArticlesComponent implements OnInit {
  public article: Article | undefined;
  public userIsConnected = false;
  public canWrite = false;

  constructor(public globalService: GlobalService,
              public authService: AuthService,
              private router: Router,
              private matDialog: MatDialog) {

    if(this.authService.getCurrentFirebaseUser() != undefined) {
      this.userIsConnected = true;
    } else {
      this.userIsConnected = false;
    }
    // Appelé lors de la connexion d'un utilisateur
    firebase.default.auth().onAuthStateChanged((u) => {
        this.userIsConnected = (u != null);
        if (this.userIsConnected === true) {
          const d = this.authService.getCurrentUser()?.status;
          // tslint:disable-next-line:no-bitwise
          if ((d! & Droits.editArticle) === Droits.editArticle) {
            this.canWrite = true;
          } else {
            this.canWrite = true;
          }
      } else {
        this.canWrite = false;
      }
    });
  }

  ngOnInit() {
    if (this.authService.getCurrentUser() != undefined) {
      const d = this.authService.getCurrentUser()?.status;
      // tslint:disable-next-line:no-bitwise
      if ((d! & Droits.editArticle) === Droits.editArticle) {
        this.canWrite = true;
      } else {
        this.canWrite = false;
      }
    }
 }

  onEdit(a: Article) {
    this.router.navigate(['app-edit-article/', a.id]);
  }

  onAddArticle() {
    this.router.navigate(['app-add-article']);
  }

  onZoom(a: Article) {
    this.globalService.currentArticle = a;
    const dialogRef = this.matDialog.open(DialogMaximiseArticleImageComponent, {
      height: '90%',
      width: '60%'
    });
  }
}

// ====================================================
//      Images maximisée dans une DialogBox
// =====================================================
@Component({
  selector: 'app-dialog-maximise-article-image',
  templateUrl: './article-dialog.html',
  styleUrls: ['./article-dialog.css']
})
export class DialogMaximiseArticleImageComponent {
  image: string;
  image2: string;
  texte: string;
  titre: string;
  sousTitre: string = '';;

  constructor(private globalService: GlobalService) {
      this.image = globalService.currentArticle.photo;
      this.image2 = globalService.currentArticle.photo2;
      this.texte = globalService.currentArticle.texte;
      this.titre = globalService.currentArticle.titre;
  }

}
