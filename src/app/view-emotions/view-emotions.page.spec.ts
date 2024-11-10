import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ViewEmotionsPage } from './view-emotions.page';

describe('ViewEmotionsPage', () => {
  let component: ViewEmotionsPage;
  let fixture: ComponentFixture<ViewEmotionsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewEmotionsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
