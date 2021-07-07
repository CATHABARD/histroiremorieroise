import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { GlobalService, Droits } from 'src/app/services/global.service';
import { Pdf } from '../../modeles/pdf';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/modeles/user';
import * as firebase from 'firebase/app';
import "firebase/auth";
import "firebase/firestore";

@Component({
  selector: 'app-liste-pdf',
  templateUrl: './liste-pdf.component.html',
  styleUrls: ['./liste-pdf.component.scss']
})
export class ListePdfComponent implements OnDestroy {
  url: string | undefined = '';
  canWrite = false;
  isConnected = false;
  private currentUser: User | undefined | null;

  constructor(private sanitizer: DomSanitizer,
              private router: Router,
              public globalService: GlobalService,
              private authService: AuthService) {
                this.canWrite = false;
                firebase.default.auth().onAuthStateChanged(u => {
                  if (u == null) {
                    this.currentUser = null;
                    this.isConnected = false;
                  } else {
                    this.currentUser = authService.getCurrentUser();
                    this.isConnected = true;
                  }
                    if (this.isConnected && this.currentUser) {
                      const d = this.currentUser.status;
                      // tslint:disable-next-line:no-bitwise
                      if ((d! & Droits.editArticle) === Droits.editArticle) {
                        this.canWrite = true;
                      } else {
                        this.canWrite = false;
                      }
                  } else {
                    this.canWrite = false;
                  }
                });
                this.globalService.emitPdf();
                if (this.currentUser != undefined) {
                    const d = this.currentUser.status;
                    // tslint:disable-next-line:no-bitwise
                    if ((d! & Droits.editArticle) === Droits.editArticle) {
                      this.canWrite = true;
                    } else {
                      this.canWrite = false;
                    }
                  }
                this.globalService.getListePdfsValides();
            }

  ngOnDestroy() {

  }

  onAddPdf() {
    this.router.navigate(['app-add-pdf']);
  }

  onEditPdf(p: Pdf) {
    this.router.navigate(['app-edit-pdf/', p.id]);
  }

  onValiderPdf(p: Pdf) {
    this.globalService.validerPdf(p);
  }

  onDeletePdf(p: Pdf) {
    this.globalService.supprimerPdf(p);
  }

  onVoirPdf(p: Pdf) {
    (this.url === p.fichier) ? this.url = '' : (this.url = p.fichier);
  }
}
