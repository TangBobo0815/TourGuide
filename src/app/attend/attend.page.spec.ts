import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AttendPage } from './attend.page';

describe('AttendPage', () => {
  let component: AttendPage;
  let fixture: ComponentFixture<AttendPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AttendPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AttendPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
