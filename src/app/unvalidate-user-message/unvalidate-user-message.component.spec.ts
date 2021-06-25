import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnvalidateUserMessageComponent } from './unvalidate-user-message.component';

describe('UnvalidateUserMessageComponent', () => {
  let component: UnvalidateUserMessageComponent;
  let fixture: ComponentFixture<UnvalidateUserMessageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnvalidateUserMessageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnvalidateUserMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
