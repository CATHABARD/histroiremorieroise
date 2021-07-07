import { Component, OnInit, Input } from '@angular/core';
import { Pdf } from '../../../modeles/pdf';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { GlobalService, Status } from 'src/app/services/global.service';
import { Location } from '@angular/common';
import { FileValidator } from 'ngx-material-file-input';

@Component({
  selector: 'app-pdf-form',
  templateUrl: './pdf-form.component.html',
  styleUrls: ['./pdf-form.component.scss']
})
export class PdfFormComponent implements OnInit {
  @Input() pdf: Pdf | undefined;
  form: FormGroup;
  errorMessage: string = '';

  readonly maxSize = 104857600;
  fileIsUploading = false;
  fileUrl: string = '';
  fileUploaded: boolean = false;

  constructor(private formBuilder: FormBuilder,
              private location: Location,
              public globalService: GlobalService) {
                if (this.pdf == undefined) {
                  this.pdf = new Pdf();
                }
                if (this.pdf?.id === '') {
                  this.fileUploaded = false;
                  this.form = this.formBuilder.group({
                    fichier: [undefined, [FileValidator.maxContentSize(this.maxSize)]],
                    progressbar: ['Progression'],
                    titre: ['', [Validators.required, Validators.maxLength(50)]],
                    description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(100)]],
                  });
                } else {
                  this.fileUploaded = true;
                  this.form = this.formBuilder.group({
                    fichier: [{value: undefined, visible: false}],
                    titre: [this.pdf?.titre, [Validators.required, Validators.maxLength(50)]],
                    description: [this.pdf?.description, [Validators.required, Validators.minLength(10), Validators.maxLength(100)]],
                  });
                }
            
              }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
  }

  detectFiles(event: any) {
    this.onUploadFile(event.target.files[0]);
  }

  onUploadFile(file: File) {
    this.fileIsUploading = true;
    this.globalService.uploadFileAndGetMetadata('pdf/', file);
  }

  getErrorMessage(ctrl: string) {
    let msg = '';

    switch (ctrl) {
      case 'pdf':
        if (this.form?.controls.fichier.touched) {
          msg = this.form.controls.fichier.hasError('maxSize') ? 'Vous devez sélectionner un fichier de moins de 16mo' : '';
        }
        break;
      case 'titre':
        if (this.form?.controls.titre.touched) {
          msg = this.form.controls.titre.hasError('required') ? 'Vous devez saisir un titre' : '';
        }
        if ( this.form?.get('titre')?.hasError('maxlength')) {
          msg += 'le titre doit comporter au plus 50 caractères';
        }
        break;
      case 'description':
        if (this.form?.get('description')?.touched) {
          if ( this.form?.get('description')?.hasError('required')) {
            msg = this.form.controls.description.hasError('required') ? 'Vous devez saisir une description du contenu du document' : '';
          }
          if ( this.form?.get('description')?.hasError('minlength')) {
            msg += 'la description doit comporter au moins 10 caractères';
          }
          if ( this.form?.get('description')?.hasError('maxlength')) {
            msg += 'la description doit comporter au plus 100 caractères';
          }
        }
      }
    return msg;
  }

  onSubmit() {
    this.pdf!.titre = this.form?.get('titre')?.value;
    this.pdf!.description = this.form?.get('description')?.value;

    if (this.pdf?.id  === '') {
      this.pdf.fichier = this.fileUrl;
      this.pdf.status = Status.initial;
      this.globalService.addPdf(this.pdf);
    } else {
      this.globalService.updatePdf(this.pdf!);
    }
    this.location.back();
  }
}
