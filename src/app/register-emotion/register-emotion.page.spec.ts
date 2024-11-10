import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterEmotionPage } from './register-emotion.page';

describe('RegisterEmotionPage', () => {
  let component: RegisterEmotionPage;
  let fixture: ComponentFixture<RegisterEmotionPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterEmotionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
