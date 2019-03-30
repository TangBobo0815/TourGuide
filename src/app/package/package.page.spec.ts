import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PackagePage } from './package.page';

describe('PackagePage', () => {
  let component: PackagePage;
  let fixture: ComponentFixture<PackagePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PackagePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PackagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
