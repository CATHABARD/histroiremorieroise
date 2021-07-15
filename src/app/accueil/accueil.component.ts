import { GlobalService } from '../services/global.service';
import { Article } from '../modeles/article';
import { Photo } from '../modeles/photo';
import { Component, OnDestroy, OnInit } from '@angular/core';
import "firebase/auth";
import "firebase/firestore";

@Component({
  selector: 'app-accueil',
  templateUrl: './accueil.component.html',
  styleUrls: ['./accueil.component.css']
})
export class AccueilComponent implements OnInit, OnDestroy {
  articles: Article[] = [];
  photos: Photo[] = [];
  photoDebut = 0;
  photoFin = 0;
  articleDebut = 0;
  articleFin = 0;
  articleCourant = 0;
  photoCourante = 0;
  readonly pasPhotos = 4;
  readonly pasArticles = 4;
  pageCourantePhoto = 0;
  pageCouranteArticle = 0;
  nbPagesPhotos = 0;
  nbPagesArticles = 0;

  
  constructor(public globalService: GlobalService) {

  }

  // Initialisation de la page
  ngOnInit() {
    this.photoFin = Math.round(this.globalService.allPhotos.length);
    this.articleFin = Math.round(this.globalService.allArticles.length);
    this.nbPagesArticles = Math.round(this.articleFin / this.pasArticles) + 1;
    this.nbPagesPhotos = Math.round(this.photoFin / this.pasPhotos) + 1;
}

  ngOnDestroy() {

  }

  onDecrementePhoto() {
    this.photoCourante -= this.pasPhotos;
    this.pageCourantePhoto = Math.round(this.photoCourante / this.pasPhotos);
  }

  onIncrementePhoto() {
    this.photoCourante += this.pasArticles;
    this.pageCourantePhoto = Math.round(this.photoCourante / this.pasPhotos);
  }

  onDecrementeArticle() {
    this.articleCourant -= this.pasArticles;
    this.pageCouranteArticle = Math.round(this.articleCourant / this.pasArticles);
  }

  onIncrementeArticle() {
    this.articleCourant += this.pasArticles;
    this.pageCouranteArticle = Math.round(this.articleCourant / this.pasArticles);
  }

}
