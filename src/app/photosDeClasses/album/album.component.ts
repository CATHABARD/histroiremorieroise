import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { GlobalService, Droits } from 'src/app/services/global.service';
import { MatDialog } from '@angular/material/dialog';
import { Photo } from '../../modeles/photo';
import { PhotosService } from 'src/app/services/photos.service';
import { AuthService } from 'src/app/services/auth.service';
import * as firebase from 'firebase';

@Component({
  selector: 'app-album',
  templateUrl: './album.component.html',
  styleUrls: ['./album.component.css']
})
export class AlbumComponent implements OnDestroy {
  public selectedPhoto: Photo | undefined;
  public zoom = false;
  queryParamsSuscription: Subscription | undefined;
  public isConnected = false;
  public canWrite: boolean;

  listePhotos: Photo[] = [];

  debut = 0;
  fin = 0;

  constructor(public route: ActivatedRoute,
              private router: Router,
              public photosService: PhotosService,
              public globalService: GlobalService,
              private authService: AuthService,
              private matDialog: MatDialog) {

      this.canWrite = false;
      firebase.default.auth().onAuthStateChanged(u => {
        (connected: boolean) => {
          (u == null)? this.isConnected = false : this.isConnected = true;
          this.isConnected = connected;
          if (this.isConnected && this.authService.getCurrentUser() != undefined) {
            const d = this.authService.getCurrentUser()?.status;
            // tslint:disable-next-line:no-bitwise
            if ((d! & Droits.editPhotosDeClasse) === Droits.editPhotosDeClasse) {
              this.canWrite = true;
            } else {
              this.canWrite = false;
            }
        } else {
          this.canWrite = false;
        }
      };

      if (this.authService.getCurrentUser() != undefined) {
        const d = this.authService.getCurrentUser()?.status;
        // tslint:disable-next-line:no-bitwise
        if ((d! & Droits.editPhotosDeClasse) === Droits.editPhotosDeClasse) {
          this.canWrite = true;
        } else {
          this.canWrite = false;
        }
      }

      this.queryParamsSuscription = this.route.queryParamMap.subscribe(param => {
        if (param.has('debut')) {
          this.debut = 0;
          this.fin = 0;
          const D = (param.get('debut') as unknown) as number;
          const F = (param.get('fin') as unknown) as number;

          if (param.get('debut') != null && (D) != this.debut) {
            this.debut = D;
          }
          if (F != null && F !== this.fin) {
            this.fin = F;
            this.isCompleted();
          }
        }
      },
      (error) => {
        console.log('Erreur : ' + error);
      });
    });   
  }

  ngOnDestroy() {
    if (this.queryParamsSuscription != null) {
      this.queryParamsSuscription.unsubscribe();
    }
  }

  isCompleted() {
    if (this.debut !== 0 &&
        this.fin !== 0) {
      this.globalService.listePhotos = [];
      this.chargePhotos();
    }
  }

  chargePhotos() {
    this.globalService.listePhotos.splice(0);

    this.photosService.getPhotosByPeriode(this.debut, this.fin).subscribe(photos => {
      this.listePhotos = photos.filter(v => {
        if ((v.payload.doc.data() as Photo).status === 1) {
           return true;
        } else {
          return false;
        }
      }).map(item => {
        const d = item.payload.doc.data() as Photo;
        d.id = item.payload.doc.id;
        this.globalService.getUserPhotoById(d);
        return d;
      },
      (error: any) => {
        console.log('Erreur de chargement des photos ' + error);
      });
    });
  }

  onZoomImage() {
    this.zoom = true;
  }

  onDeZoomImage() {
    this.zoom = false;
  }

  onAddPhoto() {
    this.router.navigate(['app-add-photo-de-classe']);
  }

  onEdit(p: Photo) {
    this.router.navigate(['app-edit-photo-de-classe/', p.id]);
  }

  onSurvol(p: Photo) {
    this.globalService.currentPhoto = p;
    const dialogRef = this.matDialog.open(DialogMaximiseImageComponent, {
      height: '100%',
      width: '55%'
    });
  }
}

// ====================================================
//      Images maximisée dans une DialogBox
// =====================================================
@Component({
  selector: 'app-dialog-maximise-image',
  templateUrl: './photo-dialog.html',
  styleUrls: ['./dialog-content-dialog.css']
})
export class DialogMaximiseImageComponent {
  image: string;
  listeEleves: string;
  titre: string;
  sousTitre: string;

  constructor(private globalService: GlobalService) {
    this.image = globalService.currentPhoto?.photo!;
    this.listeEleves = globalService.currentPhoto?.listeEleves!;
    this.titre = globalService.currentPhoto?.titre!;
    this.sousTitre = '' + globalService.currentPhoto?.annee!.toString();
  }

}
