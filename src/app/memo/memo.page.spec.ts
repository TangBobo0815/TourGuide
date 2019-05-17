import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MemoPage } from './memo.page';

describe('MemoPage', () => {
  let component: MemoPage;
  let fixture: ComponentFixture<MemoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MemoPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MemoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
