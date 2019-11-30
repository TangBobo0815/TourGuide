import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StarPPage } from './star-p.page';

describe('StarPPage', () => {
  let component: StarPPage;
  let fixture: ComponentFixture<StarPPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StarPPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StarPPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
