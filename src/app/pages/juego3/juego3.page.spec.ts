import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Juego3Page } from './juego3.page';

describe('Juego3Page', () => {
  let component: Juego3Page;
  let fixture: ComponentFixture<Juego3Page>;

  beforeEach(() => {
    fixture = TestBed.createComponent(Juego3Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
