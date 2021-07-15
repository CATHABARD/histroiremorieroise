import { Component, OnInit, OnDestroy } from '@angular/core';
import { Photo } from '../../modeles/photo';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from 'src/app/services/global.service';
import { Subscription } from 'rxjs';
import { PhotosService } from 'src/app/services/photos.service';

@Component({
  selector: 'app-edit-photo-de-classe',
  templateUrl: './edit-photo-de-classe.component.html',
  styleUrls: ['./edit-photo-de-classe.component.css']
})
export class EditPhotoDeClasseComponent implements OnInit, OnDestroy {
  public photo: Photo | undefined;
  getPhotoSuscription: Subscription | undefined;

  constructor(private route: ActivatedRoute,
              private photosService: PhotosService) {

                const id = this.route.snapshot.params.id;
                this.getPhotoSuscription = this.photosService.getPhoto(id).subscribe(data => {
                  this.photo = data.payload.data() as Photo;
                  this.photo.id = data.payload.id;
                },
                (error) => {
                  console.log('Erreur = ' + error);
                });
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.getPhotoSuscription?.unsubscribe();
  }
}
