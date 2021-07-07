import { Component, OnInit, Input } from '@angular/core';
import { Article } from '../../modeles/article';
import { FormGroup, FormBuilder, Validators, Form } from '@angular/forms';
import { GlobalService } from 'src/app/services/global.service';
import { FileValidator } from 'ngx-material-file-input';
import { EditArticleComponent } from '../edit-article/edit-article.component';
import { Observable } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';
import { Location } from '@angular/common';
import { AuthService } from 'src/app/services/auth.service';
import { ArticlesService } from 'src/app/services/articles.service';

@Component({
  selector: 'app-article-form',
  templateUrl: './article-form.component.html',
  styleUrls: ['./article-form.component.css'],
  providers: [EditArticleComponent]
})
export class ArticleFormComponent implements OnInit {
  @Input() article: Article | undefined;

  form: FormGroup;
  errorMessage: string = '';
  fileIsUploading = false;
  fileUrl: string = '';
  fileUploaded = false;
  isFileAttached: boolean;

  readonly maxSize = 100000000;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
  .pipe(
    map(result => result.matches)
  );

  constructor(private formBuilder: FormBuilder,
              private globalService: GlobalService,
              private authService: AuthService,
              private articlesService: ArticlesService,
              private location: Location,
              private breakpointObserver: BreakpointObserver) {
                if (this.article?.id === '') {
                  this.isFileAttached = false;
                  this.form = this.formBuilder.group({
                  photo: [undefined, [FileValidator.maxContentSize(this.maxSize)]],
                  progressbar: ['Progression'],
                  legende: [''],
                  titre: ['', [Validators.required, Validators.maxLength(60)]],
                  texte: ['', [Validators.required, Validators.minLength(20), Validators.maxLength(6500)]],
                });
              } else {
                if (this.article?.photo !== '') {
                  this.isFileAttached = true;
                } else {
                  this.isFileAttached = false;
                }
                this.form = this.formBuilder.group({
                  photo: [{ value: undefined, visible: this.isFileAttached }],
                  progressbar: [{value: 'Progression', visible: this.isFileAttached }],
                  legende: [this.article?.legende],
                  titre: [this.article?.titre, [Validators.required, Validators.maxLength(60)]],
                  texte: [this.article?.texte, [Validators.required, Validators.minLength(20), Validators.maxLength(6500)]],
                });
                this.fileUploaded = true;
              }
           }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
  }

  getErrorMessage(ctrl: string) {
    let msg = '';

    switch (ctrl) {
      case 'photo':
        if (this.form.controls.photo.touched) {
          msg = this.form.controls.photo.hasError('maxSize') ? 'Vous devez sélectionner une photo de moins de 100mo' : '';
        }
        break;
      case 'titre':
        if (this.form.controls.titre.touched) {
          if (this.form.controls.titre.hasError('required')) {
            msg = 'Vous devez saisir un titre.';
          }
          if (this.form.controls.titre.hasError('maxlength')) {
            msg = 'Le titre ne doit pas comporter plus de 60 caractères.';
          }
        }
        break;
      case 'texte':
        if (this.form.controls.texte.touched) {
          if (this.form.controls.texte.hasError('required')) {
            msg = 'Vous devez saisir un texte.';
          }
          if (this.form.controls.texte.hasError('minlength')) {
            msg = 'Le texte doit comporter plus de 20 caractères.';
          }
          if (this.form.controls.texte.hasError('maxlength')) {
            msg = 'Le texte ne doit pas comporter plus de 6500 caractères.';
          }
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
    this.globalService.uploadFileAndGetMetadata('Images/', file).downloadUrl.subscribe((url: string) => {
        this.fileUrl = url;
        this.fileIsUploading = false;
        this.fileUploaded = true;
      }
    );
  }

  onSubmit() {
    (this.article != undefined)? this.article.titre =  this.form.get('titre')?.value : '';
    (this.article != undefined)? this.article.texte =  this.form.get('texte')?.value : '';
    (this.article != undefined)? this.article.idTheme = this.globalService.currentTheme?.id : '';
    (this.article != undefined)? this.article.photo = this.fileUrl : '';
    (this.article != undefined)? this.article.legende = this.form.get('legende')?.value : '';
    // Ajouter un article
    if (this.article?.id === '') {
      this.article.auteur = this.authService.getCurrentUser()?.uid;
      this.articlesService.addArticle(this.article).then(res => {
        console.log(this.article);
        alert('Merci pour cet article qui sera trés prochainement publié.');
      });
    } else { // mettre un article à jour
      this.articlesService.updateArticle(this.article!).then(res => {
      });
    }
    this.location.back();
  }
}
