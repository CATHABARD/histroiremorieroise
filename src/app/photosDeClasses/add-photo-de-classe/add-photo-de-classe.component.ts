import { Component, OnInit, OnDestroy } from '@angular/core';
import { Photo } from '../../modeles/photo';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { shareReplay } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import * as firebase from 'firebase';

@Component({
  selector: 'app-add-photo-de-classe',
  templateUrl: './add-photo-de-classe.component.html',
  styleUrls: ['./add-photo-de-classe.component.css']
})
export class AddPhotoDeClasseComponent implements OnInit {
  public photo: Photo;
  isConnected = false;
  userDroits: number | undefined = 0;

  constructor(private route: ActivatedRoute,
              private authService: AuthService) {
      this.photo = new Photo('', undefined, this.authService.getCurrentUser()?.id, '', '', '');
      firebase.default.auth().onAuthStateChanged(u => {
        (u == null)? this.isConnected = false: this.isConnected = true;
      this.userDroits = this.authService.getCurrentUser()?.status;
    });
  }

  ngOnInit() {

  }

}
