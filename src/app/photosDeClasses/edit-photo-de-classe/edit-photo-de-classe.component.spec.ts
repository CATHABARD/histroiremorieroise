import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPhotoDeClasseComponent } from './edit-photo-de-classe.component';

describe('EditPhotoDeClasseComponent', () => {
  let component: EditPhotoDeClasseComponent;
  let fixture: ComponentFixture<EditPhotoDeClasseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditPhotoDeClasseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditPhotoDeClasseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
