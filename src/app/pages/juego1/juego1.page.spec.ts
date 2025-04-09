import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Juego1Page } from './juego1.page';

describe('Juego1Page', () => {
  let component: Juego1Page;
  let fixture: ComponentFixture<Juego1Page>;

  beforeEach(() => {
    fixture = TestBed.createComponent(Juego1Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
