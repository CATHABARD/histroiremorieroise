import { Injectable } from '@angular/core';
import { GlobalService, Status } from './global.service';
import { Article } from '../modeles/article';
import { AngularFirestore, DocumentChangeAction } from '@angular/fire/firestore';
import { Theme } from '../modeles/themes';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ArticlesService {
  private currentArticle: Article | undefined;
  private articlesAValider: Article[] = [];

  constructor(private afs: AngularFirestore) { }

  public addArticle(article: Article) {
    return this.afs.collection('Articles').add({
      auteur: article.auteur,
      titre: article.titre,
      texte: article.texte,
      date: article.date,
      idTheme: article.idTheme!.trim(),
      photo: article.photo,
      legende: article.legende,
      status: Status.initial
    });
  }

  getArticles() {
      return this.afs.collection('Articles').snapshotChanges();
  }

  getArticle(id: string) {
    console.log(id);
    return this.afs.collection('Articles').doc(id).snapshotChanges();
}

  getArticlesOfTheme(theme: Theme): Observable<DocumentChangeAction<unknown>[]> {
    return this.afs.collection('Articles', ref => ref.where('idTheme', '==', theme.id)  ).snapshotChanges();
  }

  getArticlesAValiderFromDB() {
    this.afs.collection('Articles', ref => ref.where('status', '==', Status.initial)).snapshotChanges().subscribe(data => {
      this.articlesAValider = data.map(e => {
          const a = e.payload.doc.data() as Article;
          a.id = e.payload.doc.id;
          return a;
      });
    });
  }

  getArticlesAValider() {
    return this.afs.collection('Articles', ref => ref.where('status', '==', 0)).snapshotChanges();
  }

  valideArticle(article: Article) {
    return this.afs.collection('Articles').doc(article.id).update({
      status: Status.valide
    });
  }

  rejeteArticle(article: Article) {
    return this.afs.collection('Articles').doc(article.id).update({
      status: Status.rejete
    });
  }

  ChangeCurrentArticle(a: Article) {
    this.currentArticle = a;
  }

  AddArticleToTheme(a: Article, t: Theme) {
    t.articles!.push(a);
    return this.addArticle(a);
  }

  updateArticle(article: Article) {
    if (article.photo === undefined) {
      return this.afs.collection('Articles').doc(article.id).update({
      titre: article.titre,
      texte: article.texte,
      legende: article.legende,
      date: article.date,
      idTheme: article.idTheme!.trim(),
      status: article.status
    });
  } else {
    return this.afs.collection('Articles').doc(article.id).update({
      titre: article.titre,
      texte: article.texte,
      legende: article.legende,
      date: article.date,
      idTheme: article.idTheme!.trim(),
      status: article.status,
      photo: article.photo
    });
  }
  }


}