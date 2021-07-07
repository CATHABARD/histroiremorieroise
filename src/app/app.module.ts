import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import {A11yModule} from '@angular/cdk/a11y';
import {ClipboardModule} from '@angular/cdk/clipboard';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {PortalModule} from '@angular/cdk/portal';
import {ScrollingModule} from '@angular/cdk/scrolling';
import {CdkStepperModule} from '@angular/cdk/stepper';
import {CdkTableModule} from '@angular/cdk/table';
import {CdkTreeModule} from '@angular/cdk/tree';

import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatBadgeModule} from '@angular/material/badge';
import {MatBottomSheetModule} from '@angular/material/bottom-sheet';
import {MatButtonModule} from '@angular/material/button';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatCardModule} from '@angular/material/card';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatChipsModule} from '@angular/material/chips';
import {MatStepperModule} from '@angular/material/stepper';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatDialogModule} from '@angular/material/dialog';
import {MatDividerModule} from '@angular/material/divider';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatListModule} from '@angular/material/list';
import {MatMenuModule} from '@angular/material/menu';
import {MatNativeDateModule, MatRippleModule} from '@angular/material/core';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatRadioModule} from '@angular/material/radio';
import {MatSelectModule} from '@angular/material/select';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatSliderModule} from '@angular/material/slider';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatSortModule} from '@angular/material/sort';
import {MatTableModule} from '@angular/material/table';
import {MatTabsModule} from '@angular/material/tabs';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatTreeModule} from '@angular/material/tree';
import {OverlayModule} from '@angular/cdk/overlay';
import { MaterialFileInputModule } from 'ngx-material-file-input';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AccueilComponent } from './accueil/accueil.component';
import { FrameComponent } from './frame/frame.component';
import { SignInComponent } from './auth/sign-in/sign-in.component';
import { SignUpComponent } from './auth/sign-up/sign-up.component';
import { UserDatasComponent} from './auth/user-datas/user-datas.component'
import { AddPhotoDeClasseComponent } from './photosDeClasses/add-photo-de-classe/add-photo-de-classe.component'
import { AlbumComponent, DialogMaximiseImageComponent } from './photosDeClasses/album/album.component'
import { EditPhotoDeClasseComponent } from './photosDeClasses/edit-photo-de-classe/edit-photo-de-classe.component'
import { PhotosDeClasseFormComponent} from './photosDeClasses/photos-de-classe-form/photos-de-classe-form.component'

import { GlobalService } from './services/global.service';
import { AuthGuardService } from './services/auth-guard.service';
import { AuthService } from './services/auth.service';
import { PhotosService } from './services/photos.service';
import { AddPdfComponent } from './pdf/addPdf/add-pdf/add-pdf.component'
import { EditPdfComponent } from './pdf/editPdf/edit-pdf/edit-pdf.component'
import { ListePdfComponent } from './pdf/listePdf/liste-pdf.component'
import { PdfFormComponent } from './pdf/pdfForm/pdf-form/pdf-form.component'
import { AddArticleComponent} from './articles/add-article/add-article.component'
import { ArticleFormComponent } from './articles/article-form/article-form.component'
import { EditArticleComponent } from './articles/edit-article/edit-article.component'
import { DialogMaximiseArticleImageComponent, ListeArticlesComponent } from './articles/liste-articles/liste-articles.component'

import { AngularFireModule } from '@angular/fire';
import { AngularFireStorageModule } from '@angular/fire/storage'
import { AngularFirestoreModule } from '@angular/fire/firestore'
import { AngularFireAuthModule } from '@angular/fire/auth'

import { environment } from 'src/environments/environment';

import { SafePipe } from './safe.pipe';

@NgModule({
  declarations: [
    AppComponent,
    AccueilComponent,
    FrameComponent,
    SignInComponent,
    SignUpComponent,
    UserDatasComponent,
    AddPhotoDeClasseComponent,
    AlbumComponent,
    EditPhotoDeClasseComponent,
    PhotosDeClasseFormComponent,
    DialogMaximiseImageComponent,
    AddPdfComponent,
    EditPdfComponent,
    ListePdfComponent,
    PdfFormComponent,
    AddArticleComponent,
    EditArticleComponent,
    ArticleFormComponent,
    ListeArticlesComponent,
    DialogMaximiseArticleImageComponent,
    SafePipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    A11yModule,
    ClipboardModule,
    CdkStepperModule,
    CdkTableModule,
    CdkTreeModule,
    DragDropModule,
    MatAutocompleteModule,
    MatBadgeModule,
    MatBottomSheetModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatStepperModule,
    MatDatepickerModule,
    MatDialogModule,
    MatDividerModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    MatTreeModule,
    MaterialFileInputModule,
    OverlayModule,
    PortalModule,
    ScrollingModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    AngularFireStorageModule,
    AngularFirestoreModule
  ],
  providers: [
    GlobalService,
    AuthGuardService,
    AuthService,
    PhotosService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
