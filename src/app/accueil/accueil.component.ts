import { GlobalService } from '../services/global.service';
import { Article } from '../modeles/article';
import { Photo } from '../modeles/photo';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import auth from 'firebase/app';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-accueil',
  templateUrl: './accueil.component.html',
  styleUrls: ['./accueil.component.css']
})
export class AccueilComponent implements OnInit, OnDestroy {
  articles: Article[] = [];
  photos: Photo[] = [];
  photoStart = 0;
  photoEnd = 0;
  articleStart = 0;
  articleEnd = 0;
  articleCourant = 0;
  photoCourante = 0;
  pasPhotos = 4;
  pasArticles = 4;
  pageCourantePhoto = 1;
  pageCouranteArticle = 1;
  nbPagesPhotos = 0;
  nbPagesArticles = 0;
  userSuscription: Subscription | undefined;

  constructor(public globalService: GlobalService,
              private authService: AuthService) {
                this.userSuscription = this.authService.user$.subscribe(u => {
    })
  }

  // Initialisation de la page
  ngOnInit() {
  }

  ngOnDestroy() {
    this.userSuscription?.unsubscribe();
  }

  onDecrementePhoto() {
    this.photoCourante -= this.pasPhotos;
    this.pageCourantePhoto = Math.round(this.photoCourante / this.pasPhotos) + 1;
  }

  onIncrementePhoto() {
    this.photoCourante += this.pasArticles;
    this.pageCourantePhoto = Math.round(this.photoCourante / this.pasPhotos) + 1;
  }

  onDecrementeArticle() {
    this.articleCourant -= this.pasArticles;
    this.pageCouranteArticle = Math.round(this.articleCourant / this.pasArticles) + 1;
  }

  onIncrementeArticle() {
    this.articleCourant += this.pasArticles;
    this.pageCouranteArticle = Math.round(this.articleCourant / this.pasArticles) + 1;
  }

}
