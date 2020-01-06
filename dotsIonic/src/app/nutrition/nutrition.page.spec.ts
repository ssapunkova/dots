import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NutritionPage } from './nutrition.page';

describe('NutritionPage', () => {
  let component: NutritionPage;
  let fixture: ComponentFixture<NutritionPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NutritionPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NutritionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
