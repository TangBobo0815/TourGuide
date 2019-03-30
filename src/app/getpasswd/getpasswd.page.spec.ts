import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GetpasswdPage } from './getpasswd.page';

describe('Signup2Page', () => {
  let component: GetpasswdPage;
  let fixture: ComponentFixture<GetpasswdPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GetpasswdPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GetpasswdPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
