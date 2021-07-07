import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccueilComponent } from './accueil/accueil.component';
import { AddArticleComponent } from './articles/add-article/add-article.component';
import { ArticleFormComponent } from './articles/article-form/article-form.component';
import { EditArticleComponent } from './articles/edit-article/edit-article.component';
import { DialogMaximiseArticleImageComponent, ListeArticlesComponent } from './articles/liste-articles/liste-articles.component';
import { SignInComponent } from './auth/sign-in/sign-in.component';
import { SignUpComponent } from './auth/sign-up/sign-up.component';
import { UserDatasComponent } from './auth/user-datas/user-datas.component';
import { AddPdfComponent } from './pdf/addPdf/add-pdf/add-pdf.component';
import { EditPdfComponent } from './pdf/editPdf/edit-pdf/edit-pdf.component';
import { ListePdfComponent } from './pdf/listePdf/liste-pdf.component';
import { PdfFormComponent } from './pdf/pdfForm/pdf-form/pdf-form.component';
import { AddPhotoDeClasseComponent } from './photosDeClasses/add-photo-de-classe/add-photo-de-classe.component';
import { AlbumComponent } from './photosDeClasses/album/album.component';
import { EditPhotoDeClasseComponent } from './photosDeClasses/edit-photo-de-classe/edit-photo-de-classe.component';
import { PhotosDeClasseFormComponent } from './photosDeClasses/photos-de-classe-form/photos-de-classe-form.component';
import { UnvalidateUserMessageComponent } from './unvalidate-user-message/unvalidate-user-message.component';

const routes: Routes = [
  { path: 'app-accueil', component: AccueilComponent },
  { path: 'app-sign-in', component: SignInComponent},
  { path: 'app-sign-up', component: SignUpComponent},
  { path: 'app-user-data', component: UserDatasComponent},
  { path: 'app-unvalidate-user-message', component: UnvalidateUserMessageComponent},
  { path: 'app-liste-pdf', component: ListePdfComponent},
  { path: 'app-edit-pdf', component: EditPdfComponent},
  { path: 'app-add-pdf', component: AddPdfComponent},
  { path: 'app-pdf-form', component: PdfFormComponent},
  { path: 'app-liste-articles', component: ListeArticlesComponent},
  { path: 'app-edit-article', component: EditArticleComponent},
  { path: 'app-add-article', component: AddArticleComponent},
  { path: 'app-article-form', component: ArticleFormComponent},
  { path: 'app-dialog-maximise-article-image', component: DialogMaximiseArticleImageComponent},
  { path: 'app-article-form', component: ArticleFormComponent},
  { path: 'app-album', component: AlbumComponent},
  { path: 'app-edit-photo-de-classe', component: EditPhotoDeClasseComponent},
  { path: 'app-add-photo-de-classe', component: AddPhotoDeClasseComponent},
  { path: 'app-photos-de-classe-form', component: PhotosDeClasseFormComponent},
  { path: '', redirectTo: 'app-accueil', pathMatch: 'full' },
  { path: '**', redirectTo: 'app-accueil' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
