import { Component, OnInit, OnDestroy } from '@angular/core';
import { Article } from '../../modeles/article';
import { GlobalService } from 'src/app/services/global.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { ArticlesService } from 'src/app/services/articles.service';

@Component({
  selector: 'app-edit-article',
  templateUrl: './edit-article.component.html',
  styleUrls: ['./edit-article.component.css']
})
export class EditArticleComponent implements OnInit, OnDestroy {
  public article: Article | undefined;
  GetSingleArticleSuscription: Subscription;

  constructor(public globalService: GlobalService,
              private articlesService: ArticlesService,
              private route: ActivatedRoute) {
      const id = this.route.snapshot.params.id;
      alert(id);
      this.GetSingleArticleSuscription =  this.articlesService.getArticle(id).subscribe(data => {
        this.article = data.payload.data as Article;
        this.article.id = data.payload.id;
      },
      (error) => {
        console.log('Erreur = ' + error);
      });
  }

  ngOnInit() {

  }

  ngOnDestroy() {
    this.GetSingleArticleSuscription.unsubscribe();
  }

}
