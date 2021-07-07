import { Injectable } from '@angular/core';
import { Article } from '../modeles/article';
import { Message } from '../modeles/message';
import { Photo } from '../modeles/photo';
import { Theme } from '../modeles/themes';
import { User } from '../modeles/user';
import { AngularFirestore, DocumentChangeAction } from '@angular/fire/firestore';
import { from, Observable, Subject, Subscription } from 'rxjs';
import { Pdf } from '../modeles/pdf';
import { AuthService } from './auth.service';
import {
  AngularFireStorage,
  AngularFireUploadTask,
} from '@angular/fire/storage';
import { switchMap } from 'rxjs/operators';
import * as firebase from 'firebase/app';
import "firebase/auth";
import "firebase/firestore";
import { PhotosService } from './photos.service';
import { ArticlesService } from './articles.service';

export interface FilesUploadMetadata {
  uploadProgress: Observable<number | undefined>;
  downloadUrl: Observable<string>;
}
@Injectable({
  providedIn: 'root'
})
export class GlobalService {
  listeThemes: Theme[] = [];
  allPhotos: Photo[] = [];
  allArticles: Article[] = [];

  public currentTheme: Theme | undefined;
  public currentArticle: any;
  public ArticlesAValider: Article[] = [];
  public photos: Photo[] = [];
  public photosAValider: Photo[] = [];
  public pdfs: Pdf[] = [];
  public pdfsAValider: Pdf[] = [];
  public currentPdf: Pdf | undefined;

  public listePhotos: Photo[] = [];
  public currentPhoto: Photo | undefined;
  public listeMessagesNonLus: Message[] = [];
  public listeMessagesLus: Message[] = [];

  pdfSubject = new Subject<boolean>();
  photoSubject = new Subject<boolean>();

  public bytesTransfered: number = 0;

  constructor(private afs: AngularFirestore,
              private readonly afSto: AngularFireStorage,
              private photosService: PhotosService,
              private articlesService: ArticlesService) {
                firebase.default.auth().onAuthStateChanged(u => {
                  if(u != null && u.uid != '') {
                    // this.initData();
                  }
                })

  }

  emitPdf() {
    this.pdfSubject.next(true);
  }

  emitPhoto() {
    this.photoSubject.next(true);
  }


    public initData() {
    return new Promise((resolve, reject) => {
      if (firebase.default.auth().currentUser != null) {
        this.GetThemesFromDB().subscribe(t => {
          this.listeThemes = t.map(e => {
            const T = e.payload.doc.data() as Theme;
            T.id = e.payload.doc.id;
            return T;
          });
          // console.log(this.listeThemes);
          this.listeThemes.forEach(theme => {
            this.articlesService.getArticlesOfTheme(theme).subscribe(data => {
              theme.articles = data.map(e => {
                  const a = e.payload.doc.data() as Article;
                  a.id = e.payload.doc.id;
                  return a;
              });
              theme.articles?.forEach(a => {
                if (a.auteur && a.auteur.length > 0) {
                  this.getAuteurById(a);
                }
              });
            },
            (error) => {
              console.log('Erreur :' + error);
            },
            () => {
              console.log('fin de chargement des articles du thème');
            });
          });
          this.photosService.getPhotos().subscribe(data => {
            this.allPhotos = data.map(e => {
              const p = e.payload.doc.data() as Photo;
              p.id = e.payload.doc.id;
              return p;
            });
            this.emitPhoto();
            // Chargement de tous les articles
            this.articlesService.getArticles().subscribe(a => {
              this.allArticles = a.map(e => {
                const A = e.payload.doc.data() as Article;
                A.id = e.payload.doc.id;
                return A;
              });
              this.allArticles.forEach(A => {
                if (A.auteur && A.auteur.length > 0) {
                  this.getAuteurById(A);
                }
              });
            });
            if (this.listeThemes.length > 0) {
              this.currentTheme = this.listeThemes[0];
            }
            resolve(this.listeThemes);
          },
          (error) => {
            console.log('Erreur getPhotos :' + error);
            reject(error);
          });
        },
        (error) => {
          console.log('erreur chargement des Themes');
          console.log(error);
          reject(error);
        });
      }
    });
  }

  // Articles
  // Thèmes
  private GetThemesFromDB() {
    return this.afs.collection('Themes').snapshotChanges();
  }

  public GetSingleThemeFromDB(id: string) {
    this.afs.collection('Themes').doc(id).get().subscribe(data => {
      this.currentTheme!.id = data.id;
      this.currentTheme = data.data() as Theme;
    });
  }

  saveThemeToDB(theme: Theme) {
    return this.afs.collection('Themes').add({
      nom: theme.nom,
      status: theme.status,
    }).then(data => {
      // console.log(data);
    });
  }

  public changeCurrentTheme(t: Theme) {
    this.currentTheme = t;
  }

  ref: any;
  task: any;
  uploadFile(event: any) {
    // create a random id
    const randomId = Math.random().toString(36).substring(2);
    // create a reference to the storage bucket location
    this.ref = this.afSto.ref(randomId);
    // the put method creates an AngularFireUploadTask
    // and kicks off the upload
    this.task = this.ref.put(event.target.files[0]);
  }

  // User
  private getAuteurById(a: any) {
    this.afs.collection('Users', ref => ref.where('uid', '==', a.auteur)).snapshotChanges().subscribe(data => {
        const auteurs = data.map(u => {
          const d = u.payload.doc.data() as User;
          d.id = u.payload.doc.id;
          return d;
        });
        if (auteurs.length > 0) {
          a.nomAuteur = auteurs[0].prenom;
        }
    },
    (error) => {
      console.log('Erreur : ' + error);
    },
    () => {

    });
  }

  public getUserPhotoById(p: Photo) {
    this.afs.collection('Users').doc(p.auteur).get().subscribe(data => {
      const u = data.data() as User;
      p.nomAuteur = u.prenom;
  },
  (error) => {
    console.log('Erreur : ' + error);
  },
  () => {

  });
}

  public getAllUsersFromDB() {
    return this.afs.collection('Users').snapshotChanges();
  }

  public changeDroitsUser(idUser: string, droits: number)  {
    this.afs.collection('Users').doc(idUser).update({
      status: droits
    });
  }

  // photos
  public getPhotosByPeriode(debut: number, fin: number) {
    return this.afs.collection('Photos', ref => ref.where('annee', '>=', debut).where('annee', '<=', fin)).snapshotChanges();
  }

  // Liste d'images
  public getPhotosDeClasseFromStorage() {
    return this.afSto.ref('Classes').listAll();
  }

  public GetSinglePhotoFromDB(id: string) {
    return this.afs.collection('Photos').doc(id).get();
  }

  public updatePhotoToDB(p: Photo) {
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

  public getPhotosAValider() {
    this.afs.collection('Photos', ref => ref.where('status', '==', 0)).snapshotChanges().subscribe(data => {
      this.photosAValider = data.map(e => {
        const p = e.payload.doc.data() as Photo;
        p.id = e.payload.doc.id;
        return p;
      });
    },
    (error) => {
      console.log('Erreur :' + error);
    },
    () => {
    });
  }

  public validerPhoto(p: Photo) {
    return this.afs.collection('Photos').doc(p.id).update({
      status: Status.valide
    });
  }

  public rejeterPhoto(p: Photo) {
    return this.afs.collection('Photos').doc(p.id).update({
      status: Status.rejete
    });
  }


  // pdf
  private getListePdf() {
    this.afs.collection('listePdf').snapshotChanges().subscribe(data => {
      this.pdfs = data.map(e => {
        const p = e.payload.doc.data() as Pdf;
        p.id = e.payload.doc.id;
        return p;
      });
    });
    this.emitPdf();
  }

  public getListePdfsValides() {
    this.afs.collection('listePdf', ref => ref.where('Status', '==', Status.valide)).snapshotChanges().subscribe(data => {
      this.pdfs = data.map(e => {
        const p = e.payload.doc.data() as Pdf;
        p.id = e.payload.doc.id;
        return p;
      });
      this.emitPdf();
    });
  }

  public getListePdfAValider() {
    this.afs.collection('listePdf', ref => ref.where('Status', '==', Status.initial)).snapshotChanges().subscribe(data => {
      this.pdfsAValider = data.map(e => {
        const p = e.payload.doc.data() as Pdf;
        p.id = e.payload.doc.id;
        return p;
      });
    });
  }

  public GetSinglePdf(id: string) {
    this.afs.collection('listePdf').doc(id).get().subscribe(data => {
      if (this.currentPdf == null) {
        this.currentPdf = new Pdf('', '', '', '', 0);
      }
      this.currentPdf.id = data.id;
      this.currentPdf = data.data() as Pdf;
      this.emitPdf();
    });
  }

  public addPdf(pdf: Pdf) {
        // console.log(pdf);
        this.afs.collection('listePdf').add({
          description: pdf.description,
          fichier: pdf.fichier,
          Status: Status.initial,
          titre: pdf.titre
        }).then(data => {
          },
        (error) => {
          console.log('Erreur ' + error);
        });
  }

  public validerPdf(p: Pdf)  {
    p.status = Status.valide;
    this.afs.collection('listePdf').doc(p.id).update({
      Status: p.status
    });
  }

  public rejeterPdf(p: Pdf)  {
    p.status = Status.rejete;
    this.afs.collection('listePdf').doc(p.id).update(p);
  }

  public supprimerPdf(p: Pdf) {
    p.status = Status.supprime;
    this.afs.collection('listePdf').doc(p.id).update(p);
  }

  public updatePdf(p: Pdf) {
    this.afs.collection('listePdf').doc(p.id).update(p);
  }

  // Messages
  public getMessagesNonLus() {
    this.afs.collection('Messages', ref => ref.where('lu', '==', false)).snapshotChanges().subscribe(data => {
      this.listeMessagesNonLus = data.map(e => {
        const p = e.payload.doc.data() as Message;
        p.id = e.payload.doc.id;
        return p;
      });
    });
    this.emitPdf();
  }

  public addMessage(message: Message) {
    this.afs.collection('Messages').add({
        date: message.date.toJSON(),
        email: message.email,
        texte: message.texte,
        lu: message.lu
      }).then(data => {
        },
      (error) => {
        console.log('Erreur ' + error);
      });
    }

  public SoldeMessage(m: Message) {
    this.afs.collection('Messages').doc(m.id).update({
      lu: true
    });
  }

  uploadFileAndGetMetadata(
    mediaFolderPath: string,
    fileToUpload: File,
  ): FilesUploadMetadata {
    const { name } = fileToUpload;
    const filePath = `${mediaFolderPath}/${new Date().getTime()}_${name}`;
    const uploadTask: AngularFireUploadTask = this.afSto.upload(
      filePath,
      fileToUpload,
    );
    return {
      uploadProgress: uploadTask.percentageChanges(),
      downloadUrl: this.getDownloadUrl(uploadTask, filePath),
    };
  }

  private getDownloadUrl(
    uploadTask: AngularFireUploadTask,
    path: string,
  ): Observable<string> {
    return from(uploadTask).pipe(
      switchMap((_) => this.afSto.ref(path).getDownloadURL()),
    ) as Observable<string>;
  }
}

export enum Droits {
  visiteur = 1,
  moderateur = 2,
  editArticle = 4,
  editPhotosDeClasse = 8,
  administrateur = 0xFF
}

export enum Status {
  initial = 0,
  valide = 1,
  rejete = 0x100,
  supprime = 0x1000,
  visiteur = 0x10000
}
