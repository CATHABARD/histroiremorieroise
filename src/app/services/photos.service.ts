import { Injectable } from '@angular/core';
import { GlobalService } from './global.service';
import { Photo } from '../modeles/photo';

@Injectable({
  providedIn: 'root'
})
export class PhotosService {
  public photo: Photo| undefined;

  constructor(private globalService: GlobalService) { } 

  public addNewPhoto(photo: Photo) {
    // this.globalService.addPhoto(this.photo);
  }

  getPhoto(id: string) {
    /* this.globalService.GetSinglePhotoFromDB(id).subscribe(data => {
      this.photo = data.data() as Photo;
      this.photo.id = data.id;
    }); */
  }
}
