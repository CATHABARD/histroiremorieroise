import { Component, OnInit } from '@angular/core';
import { Article } from '../../modeles/article';
import { AuthService } from 'src/app/services/auth.service';
import { GlobalService } from 'src/app/services/global.service';

@Component({
  selector: 'app-add-article',
  templateUrl: './add-article.component.html',
  styleUrls: ['./add-article.component.css']
})
export class AddArticleComponent implements OnInit {
  article = new Article('', '', '', '', new Date().toJSON(), '', '', '', this.authService.getCurrentUser()?.uid, '', 0 );

  constructor(private globalService: GlobalService, private authService: AuthService) {

  }

  ngOnInit() {
  }

}
