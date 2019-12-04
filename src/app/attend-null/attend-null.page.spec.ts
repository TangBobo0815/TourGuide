import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AttendNullPage } from './attend-null.page';

describe('AttendNullPage', () => {
  let component: AttendNullPage;
  let fixture: ComponentFixture<AttendNullPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AttendNullPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AttendNullPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
