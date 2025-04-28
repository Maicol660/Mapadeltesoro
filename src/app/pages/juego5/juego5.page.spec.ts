import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Juego5Page } from './juego5.page';

describe('Juego5Page', () => {
  let component: Juego5Page;
  let fixture: ComponentFixture<Juego5Page>;

  beforeEach(() => {
    fixture = TestBed.createComponent(Juego5Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
