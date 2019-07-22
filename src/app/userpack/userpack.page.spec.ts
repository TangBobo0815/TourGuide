import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserpackPage } from './userpack.page';

describe('UserpackPage', () => {
  let component: UserpackPage;
  let fixture: ComponentFixture<UserpackPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserpackPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserpackPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
