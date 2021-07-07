import { GlobalService } from '../services/global.service';
import { Article } from '../modeles/article';
import { Photo } from '../modeles/photo';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import * as firebase from 'firebase/app';
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

  
  constructor(public globalService: GlobalService) {
                firebase.default.auth().onAuthStateChanged(u => {
    })
  }

  // Initialisation de la page
  ngOnInit() {
  }

  ngOnDestroy() {

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
