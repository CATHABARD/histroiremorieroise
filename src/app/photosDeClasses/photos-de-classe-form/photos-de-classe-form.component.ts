import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Photo } from '../../modeles/photo';
import { GlobalService } from 'src/app/services/global.service';
import { Location } from '@angular/common';
import { FileValidator } from 'ngx-material-file-input';
import { Observable } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { PhotosService } from 'src/app/services/photos.service';

@Component({
  selector: 'app-photos-de-classe-form',
  templateUrl: './photos-de-classe-form.component.html',
  styleUrls: ['./photos-de-classe-form.component.css']
})
export class PhotosDeClasseFormComponent implements OnInit {
  @Input() photo: Photo | undefined;

  addPhotoForm: FormGroup;
  errorMessage: string = '';
  hide = true;

  fileIsUploading = false;
  fileUrl: string = '';
  fileUploaded = false;
  readonly maxSize = 104857600;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
  .pipe(
    map(result => result.matches)
  );

  constructor(private formBuilder: FormBuilder,
              private globalService: GlobalService,
              private authService: AuthService,
              private photosService: PhotosService,
              private location: Location,
              private breakpointObserver: BreakpointObserver) {
                if (this.photo == undefined) {
                  this.photo = new Photo('', undefined, this.authService.getCurrentUser()?.id, '', '', '');
                }
                if (this.photo.photo == undefined) {
                  this.photo.photo = '';
                }
                if (this.photo?.id === '') {
                  this.addPhotoForm = this.formBuilder.group({
                    photo: [undefined, [Validators.required, FileValidator.maxContentSize(this.maxSize)]],
                    progressbar: ['Progression'],
                    titre: ['', [Validators.required, Validators.maxLength(50)]],
                    annee: ['', [Validators.required, Validators.min(1900), Validators.max(2020)]],
                    listeEleves: ['', [Validators.required, Validators.maxLength(3000)]]
                  });
                } else {
                  this.addPhotoForm = this.formBuilder.group({
                    photo: [{ value: undefined, disabled: true }],
                    progressbar: [{value: 'Progression', disabled: true }, null],
                    titre: [this.photo?.titre, [Validators.required, Validators.maxLength(50)]],
                    annee: [this.photo?.annee?.toString(), [Validators.required, Validators.min(1900), Validators.max(2020)]],
                    listeEleves: [this.photo?.listeEleves, [Validators.required, Validators.maxLength(3000)]]
                  });
                  this.fileUploaded = true;
                  }
            
              }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
  }

  onSubmit() {
    if (this.addPhotoForm?.invalid) {
      alert('Une valeur saisie est incorrecte.');
      return;
    }
    // console.log(this.form.get('annee').value, this.form.get('listeEleves').value);
    this.photo!.titre = this.addPhotoForm?.get('titre')?.value;
    this.photo!.annee = this.addPhotoForm?.get('annee')?.value;
    this.photo!.listeEleves = this.addPhotoForm?.get('listeEleves')?.value;

    if (this.photo!.id  === '') {
      this.photo!.photo = this.fileUrl;
      this.photo!.auteur = this.authService.getCurrentUser()?.id;
      this.photo!.nomAuteur = this.authService.getCurrentUser()?.prenom;
      this.photosService.addPhoto(this.photo!);
    } else {
      this.globalService.updatePhotoToDB(this.photo!);
    }
    this.location.back();
  }

    getErrorMessage(ctrl: string) {
      let msg = '';

      switch (ctrl) {
        case 'titre':
          if (this.addPhotoForm?.controls.titre.touched) {
            msg = this.addPhotoForm.controls.titre.hasError('required') ? 'Vous devez saisir un titre' : '';
          }
          break;
        case 'annee':
          if (this.addPhotoForm?.controls.annee.touched) {
            msg = this.addPhotoForm.controls.annee.hasError('required') ? 'Vous devez saisir une année' : '';
          }
          break;
        case 'listeEleves':
          if (this.addPhotoForm?.controls.listeEleves.touched) {
            msg = this.addPhotoForm.controls.listeEleves.hasError('required') ? 'Vous devez saisir une liste des élèves' : '';
          }
          break;
        case 'photo':
          if (this.addPhotoForm?.controls.photo.touched) {
            msg = this.addPhotoForm.controls.photo.hasError('required') ? 'Vous devez sélectionner une photo de classes' : '';
          }
          break;
        }
      return msg;
    }

    detectFiles(event: any) {
      this.onUploadFile(event.target.files[0]);
    }

    onUploadFile(file: File) {
      this.fileIsUploading = true;
      this.globalService.uploadFileAndGetMetadata('Classes/', file).downloadUrl.subscribe(
        (url: string) => {
          this.fileUrl = url;
          this.photo!.photo = url;
          this.fileIsUploading = false;
          this.fileUploaded = true;
        }
      );
    }

    onChangeVisibilite() {
      this.hide = !this.hide;
    }
}
