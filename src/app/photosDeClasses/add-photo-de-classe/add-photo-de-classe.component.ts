import { Component, OnInit, OnDestroy } from '@angular/core';
import { Photo } from '../../modeles/photo';
import { AuthService } from 'src/app/services/auth.service';
import * as firebase from 'firebase';
import { Subscription } from 'rxjs';
import { shareReplay } from 'rxjs/operators';
import { Status } from 'src/app/services/global.service';

@Component({
  selector: 'app-add-photo-de-classe',
  templateUrl: './add-photo-de-classe.component.html',
  styleUrls: ['./add-photo-de-classe.component.css']
})
export class AddPhotoDeClasseComponent implements OnInit {
  public photo: Photo;
  isConnected = false;
  userDroits: number | undefined = 0;

  private userSubscription: Subscription;

  constructor(private authService: AuthService) {
      this.photo = new Photo('', undefined, this.authService.getCurrentUser()?.id, '', '', '');

      this.userSubscription = this.authService.authSubject.pipe(shareReplay(1)).subscribe(u => {
        this.isConnected = (u.status! > Status.initial);
      })
    }

  ngOnInit() {

  }

}
