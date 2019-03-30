import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Package2Page } from './package2.page';

describe('Package2Page', () => {
  let component: Package2Page;
  let fixture: ComponentFixture<Package2Page>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Package2Page ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Package2Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
