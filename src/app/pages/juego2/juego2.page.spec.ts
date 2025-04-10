import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Juego2Page } from './juego2.page';

describe('Juego2Page', () => {
  let component: Juego2Page;
  let fixture: ComponentFixture<Juego2Page>;

  beforeEach(() => {
    fixture = TestBed.createComponent(Juego2Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
