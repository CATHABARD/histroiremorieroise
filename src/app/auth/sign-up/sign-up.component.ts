import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MustMatch } from './_helpers/must-match.validator';

export interface SignUpData {
  email: string;
  password1: string;
  nom: string;
  prenom: string;
}

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {
  signupForm = this.formBuilder.group({
    nom: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(25)]],
    prenom: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(25)]],
    email: ['', [Validators.required, Validators.email]],
    password1: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(20)]],
    password2: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(20)]]
    },
    {
      validator: MustMatch('password1', 'password2')
    });
;
  errorMessage: string = '';
  hide = true;

  constructor(private formBuilder: FormBuilder,
              public dialogRef: MatDialogRef<SignUpComponent>) {

              }

  ngOnInit() {
    this.initForm;
  }

  initForm() {

  }

  close() {
    this.dialogRef.close();
  }

  onSave() {
    this.dialogRef.close(this.signupForm!.value);
  }

  getErrorMessage(ctrl: string) {
    let msg = '';

    switch (ctrl) {
      case 'nom':
        if (this.signupForm!.controls.nom.touched && this.signupForm!.controls.nom.hasError('required')) {
          msg = 'Vous devez saisir votre nom';
        }
        if (this.signupForm!.controls.nom.touched && this.signupForm!.controls.nom.hasError('minlength') ||
            this.signupForm!.controls.nom.touched && this.signupForm!.controls.nom.hasError('maxlength')) {
              msg = 'Vous devez saisir un nom comportant entre 5 et 25 caractères';
        }
        break;
        case 'prenom':
          if (this.signupForm!.controls.prenom.touched && this.signupForm!.controls.prenom.hasError('required')) {
            msg = 'Vous devez saisir votre prénom';
          }
          if (this.signupForm!.controls.prenom.touched && this.signupForm!.controls.prenom.hasError('minlength') ||
              this.signupForm!.controls.prenom.touched && this.signupForm!.controls.prenom.hasError('maxlength')) {
            msg = 'Vous devez saisir un prénom comportant entre 3 et 25 caractères';
          }
          break;
        case 'email':
      if (this.signupForm!.controls.email.touched && this.signupForm!.controls.email.hasError('required')) {
        msg = 'Vous devez saisir une adresse email';
      }
      if (this.signupForm!.controls.email.touched && this.signupForm!.controls.email.hasError('email')) {
        msg = 'L\'adresse saisie n\'est pas valide.';
      }
      break;
    case 'password1':
      if (this.signupForm!.controls.password1.touched && this.signupForm!.controls.password1.hasError('required')) {
        msg = 'Vous devez saisir un mot de passe';
      }
      if (this.signupForm!.controls.password1.touched && this.signupForm!.controls.password1.hasError('minlength')) {
        msg = 'Vous devez saisir un mot de passe comportant entre 5 et 20 caractères';
      }
      break;
    case 'password2':
      if (this.signupForm!.controls.password2.touched && this.signupForm!.controls.password2.hasError('required')) {
        msg = 'Vous devez saisir un mot de passe';
      }
      if (this.signupForm!.controls.password2.touched && this.signupForm!.controls.password2.hasError('minlength')) {
        msg = 'Vous devez saisir un mot de passe comportant entre 5 et 20 caractères';
      }
      break;
    }
    return msg;
  }

  onChangeVisibilite() {
    this.hide = !this.hide;
  }

}
