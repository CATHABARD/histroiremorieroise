import { Component } from '@angular/core';
import { User } from './modeles/user';
import { AuthService } from './services/auth.service';
import { GlobalService } from './services/global.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'HistoireDeMorieres';
  
  constructor(private globalService: GlobalService,
    private authService: AuthService) {
    this.authService.signInVisiteur().then((user) => {
        // console.log(user);
    });
  }
}
