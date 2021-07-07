import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPhotoDeClasseComponent } from './add-photo-de-classe.component';

describe('AddPhotoDeClasseComponent', () => {
  let component: AddPhotoDeClasseComponent;
  let fixture: ComponentFixture<AddPhotoDeClasseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddPhotoDeClasseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPhotoDeClasseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
