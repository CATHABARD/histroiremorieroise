import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserDatasComponent } from './user-datas.component';

describe('UserDatasComponent', () => {
  let component: UserDatasComponent;
  let fixture: ComponentFixture<UserDatasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserDatasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserDatasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
