import { Component, OnInit } from '@angular/core';
import { Pdf } from '../../../modeles/pdf';

@Component({
  selector: 'app-add-pdf',
  templateUrl: './add-pdf.component.html',
  styleUrls: ['./add-pdf.component.scss']
})
export class AddPdfComponent implements OnInit {
  pdf = new Pdf('', '', '', '', 0);

  constructor() { }

  ngOnInit() {
  }

}
