import { Injectable } from '@angular/core';
import { Status } from './global.service';
import { Photo } from '../modeles/photo';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class PhotosService {
  public photo: Photo| undefined;

  constructor(private afs: AngularFirestore) { } 

  public addPhoto(p: Photo) {
    this.afs.collection('Photos').add({
      annee: p.annee,
      auteur: p.auteur,
      listeEleves: p.listeEleves,
      photo: p.photo,
      titre: p.titre,
      status: Status.initial
    });
  }

  getPhotos() {
    return this.afs.collection('Photos').snapshotChanges();
  }

  getPhoto(id: string) {
    return this.afs.collection('Photos').doc(id).snapshotChanges();
  }

  public getPhotosByPeriode(debut: number, fin: number) {
    return this.afs.collection('Photos').snapshotChanges();
  }

  public updatePhoto(p: Photo) {
    console.log(p);
    this.afs.collection('Photos').doc(p.id).update(
      {
        auteur: p.auteur,
        titre: p.titre,
        annee: p.annee,
        listeEleves: p.listeEleves,
        photo: p.photo,
        status: p.status
      });
  }


}
