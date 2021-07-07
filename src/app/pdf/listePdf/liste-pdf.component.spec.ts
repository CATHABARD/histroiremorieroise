import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListePdfComponent } from './liste-pdf.component';

describe('PdfComponent', () => {
  let component: ListePdfComponent;
  let fixture: ComponentFixture<ListePdfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListePdfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListePdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
