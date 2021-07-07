import { Component, OnInit, OnDestroy } from '@angular/core';
import {ActivatedRoute } from '@angular/router';
import { Pdf } from '../../../modeles/pdf';
import { GlobalService } from 'src/app/services/global.service';
import { Subscription } from 'rxjs';
import { shareReplay } from 'rxjs/operators';

@Component({
  selector: 'app-edit-pdf',
  templateUrl: './edit-pdf.component.html',
  styleUrls: ['./edit-pdf.component.scss']
})
export class EditPdfComponent implements OnInit, OnDestroy {
  pdf: Pdf | undefined;
  pdfSubscription: Subscription;

  constructor(private route: ActivatedRoute,
              private globalService: GlobalService) {
                this.pdfSubscription = this.globalService.pdfSubject.pipe(shareReplay(1)).subscribe(
                  (ready: boolean) => {
                  if ( ready) {
                    this.pdf = this.globalService.currentPdf;
                  }
                });
              }

  ngOnInit() {
    const id = this.route.snapshot.params.id;
    this.globalService.GetSinglePdf(id);
  }

  ngOnDestroy() {
    this.pdfSubscription.unsubscribe() ;
}


}
