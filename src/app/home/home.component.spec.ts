import { AppComponent } from './../app.component';
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { Router } from '@angular/router';

import { HomeComponent } from './home.component';

const mockRouter = {
  navigate() {},
};

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HomeComponent],
      providers: [{ provide: Router, useValue: mockRouter }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    //  fixture.debugElement.injector.get(a value)
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('changeUrl()', () => {
    it('should be called', () => {
      const mockChangeURL = spyOn(component, 'changeUrl');
      fixture.detectChanges();

      document.dispatchEvent(new Event('scroll'));

      expect(mockChangeURL).toHaveBeenCalled();
    });
  });
});
