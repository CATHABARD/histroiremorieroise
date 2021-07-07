import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PhotosDeClasseFormComponent } from './photos-de-classe-form.component';

describe('PhotosDeClasseFormComponent', () => {
  let component: PhotosDeClasseFormComponent;
  let fixture: ComponentFixture<PhotosDeClasseFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PhotosDeClasseFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PhotosDeClasseFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
