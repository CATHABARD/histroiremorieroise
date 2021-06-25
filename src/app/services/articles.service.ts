import { Injectable } from '@angular/core';
import { GlobalService } from './global.service';
import { Article } from '../models/article';

@Injectable({
  providedIn: 'root'
})
export class ArticlesService {
  private article: any = null;

  constructor(private globalService: GlobalService) { }

  public addNewArticle(article: Article) {
    this.globalService.addArticleToDB(article);
  }

  getArticle(id: string) {
    this.globalService.GetSingleArticleFromDB(id).subscribe(data => {
      this.article = data;
    },
    () => {
      return this.article;
    });
  }
}
