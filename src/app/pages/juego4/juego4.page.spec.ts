import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Juego4Page } from './juego4.page';

describe('Juego4Page', () => {
  let component: Juego4Page;
  let fixture: ComponentFixture<Juego4Page>;

  beforeEach(() => {
    fixture = TestBed.createComponent(Juego4Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
