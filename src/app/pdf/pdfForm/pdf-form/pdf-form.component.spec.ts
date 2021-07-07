import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PdfFormComponent } from './pdf-form.component';

describe('PdfFormComponent', () => {
  let component: PdfFormComponent;
  let fixture: ComponentFixture<PdfFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PdfFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PdfFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
