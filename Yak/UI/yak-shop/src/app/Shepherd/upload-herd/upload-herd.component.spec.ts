import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadHerdComponent } from './upload-herd.component';

describe('UploadHerdComponent', () => {
  let component: UploadHerdComponent;
  let fixture: ComponentFixture<UploadHerdComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadHerdComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadHerdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
