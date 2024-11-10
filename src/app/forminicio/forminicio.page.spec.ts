import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ForminicioPage } from './forminicio.page';

describe('ForminicioPage', () => {
  let component: ForminicioPage;
  let fixture: ComponentFixture<ForminicioPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ForminicioPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
