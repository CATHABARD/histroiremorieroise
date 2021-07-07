import { Injectable } from '@angular/core';
import { GlobalService, Status } from './global.service';
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
      nomAuteur: p.nomAuteur,
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
    return this.afs.collection('Photos', ref => ref.where('annee', '>=', debut).where('annee', '<=', fin)).snapshotChanges();
  }

}
