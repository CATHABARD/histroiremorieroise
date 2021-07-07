import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface SignUpData {
  email: string;
  nom: string;
  prenom: string;
}


@Component({
  selector: 'app-user-datas',
  templateUrl: './user-datas.component.html',
  styleUrls: ['./user-datas.component.scss']
})
export class UserDatasComponent implements OnInit {
  userDatasForm: FormGroup = this.formBuilder.group({
    nom: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(25)]],
    prenom: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(25)]],
    email: [{value: this.authService.getCurrentUser()!.email, disabled: true}],
    });
;
  errorMessage: string = '';
  description: string = '';

  constructor(private formBuilder: FormBuilder,
              private authService: AuthService,
              public dialogRef: MatDialogRef<UserDatasComponent>,
              @Inject(MAT_DIALOG_DATA) private data: SignUpData) {

  }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
  }

  close() {
    this.dialogRef.close();
  }

  save() {
    this.dialogRef.close(this.userDatasForm.value);
  }

  getErrorMessage(ctrl: string) {
    let msg = '';

    switch (ctrl) {
      case 'nom':
        if (this.userDatasForm.controls.nom.touched && this.userDatasForm.controls.nom.hasError('required')) {
          msg = 'Vous devez saisir votre nom';
        }
        if (this.userDatasForm.controls.nom.touched && this.userDatasForm.controls.nom.hasError('minlength') ||
            this.userDatasForm.controls.nom.touched && this.userDatasForm.controls.nom.hasError('maxlength')) {
              msg = 'Vous devez saisir un nom comportant entre 5 et 25 caractères';
        }
        break;
        case 'prenom':
          if (this.userDatasForm.controls.prenom.touched && this.userDatasForm.controls.prenom.hasError('required')) {
            msg = 'Vous devez saisir votre prénom';
          }
          if (this.userDatasForm.controls.prenom.touched && this.userDatasForm.controls.prenom.hasError('minlength') ||
              this.userDatasForm.controls.prenom.touched && this.userDatasForm.controls.prenom.hasError('maxlength')) {
            msg = 'Vous devez saisir un prénom comportant entre 3 et 25 caractères';
          }
          break;
        case 'email':
      if (this.userDatasForm.controls.email.touched && this.userDatasForm.controls.email.hasError('required')) {
        msg = 'Vous devez saisir une adresse email';
      }
      if (this.userDatasForm.controls.email.touched && this.userDatasForm.controls.email.hasError('email')) {
        msg = 'L\'adresse saisie n\'est pas valide.';
      }
      break;
    case 'password1':
      if (this.userDatasForm.controls.password1.touched && this.userDatasForm.controls.password1.hasError('required')) {
        msg = 'Vous devez saisir un mot de passe';
      }
      if (this.userDatasForm.controls.password1.touched && this.userDatasForm.controls.password1.hasError('minlength')) {
        msg = 'Vous devez saisir un mot de passe comportant entre 5 et 20 caractères';
      }
      break;
    case 'password2':
      if (this.userDatasForm.controls.password2.touched && this.userDatasForm.controls.password2.hasError('required')) {
        msg = 'Vous devez saisir un mot de passe';
      }
      if (this.userDatasForm.controls.password2.touched && this.userDatasForm.controls.password2.hasError('minlength')) {
        msg = 'Vous devez saisir un mot de passe comportant entre 5 et 20 caractères';
      }
      break;
    }
    return msg;
  }
}
