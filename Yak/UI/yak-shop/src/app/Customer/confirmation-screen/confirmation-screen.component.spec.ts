import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmationScreenComponent } from './confirmation-screen.component';

describe('ConfirmationScreenComponent', () => {
  let component: ConfirmationScreenComponent;
  let fixture: ComponentFixture<ConfirmationScreenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmationScreenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmationScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
