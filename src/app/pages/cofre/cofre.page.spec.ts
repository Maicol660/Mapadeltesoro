import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CofrePage } from './cofre.page';

describe('CofrePage', () => {
  let component: CofrePage;
  let fixture: ComponentFixture<CofrePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CofrePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
