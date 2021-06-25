import { Component, OnInit, Inject } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth.service';

export interface SignInData {
  email: string;
  password: string;
}
/** @title Input with a custom ErrorStateMatcher */
@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {
  signinForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(20)]]
  });
  errorMessage: string = '';
  hide = true;


  constructor(private authService: AuthService, private formBuilder: FormBuilder,
              public dialogRef: MatDialogRef<SignInComponent>,
              @Inject(MAT_DIALOG_DATA) public data: SignInData) {
                
              }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
  }

  save() {
    this.dialogRef.close(this.signinForm!.value);
  }

  close() {
    this.dialogRef.close();
  }

  getErrorMessage(ctrl: string) {
    let msg = '';
    switch (ctrl) {
      case 'email':
        if (this.signinForm != undefined && this.signinForm.get('email')!.hasError('required')) {
          msg = 'Vous devez saisir une adresse email. ';
          break;
        }
        if (this.signinForm != undefined && this.signinForm!.get('email')!.hasError('email')) {
          msg = 'L\'adresse saisie n\'est pas valide.';
          break;
        }
        break;
      case 'password':
        if (this.signinForm != undefined && this.signinForm.controls.password.hasError('required')) {
          msg = 'Vous devez saisir un mot de passe. ';
          break;
        }
        if (this.signinForm != undefined && this.signinForm.controls.password.hasError('minlength')) {
          msg = 'Vous devez saisir un mot de passe comportant au moins 5 caractères';
          break;
        }
        if (this.signinForm != undefined && this.signinForm.controls.password.hasError('maxlength')) {
          msg = 'Vous devez saisir un mot de passe comportant au plus 20 caractères';
          break;
        }
        break;
      }
    return msg;
  }

  onMotDePasseOublie() {
    if (this.signinForm != undefined && this.signinForm.get('email')!.valid === true) {
      this.authService.ForgotPassword(this.signinForm.get('email')!.value);
    } else {
      alert('Merci de saisir l\'adresse mail avec laquelle vous avez créé votre compte.');
    }
  }

  onChangeVisibilite() {
    this.hide = !this.hide;
  }
}
