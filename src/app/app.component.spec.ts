import {
  fakeAsync,
  TestBed,
  tick,
  ComponentFixture,
} from '@angular/core/testing';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let app: AppComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AppComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    app = fixture.componentInstance;
  });

  it('should create the app', () => {
    expect(app).toBeTruthy();
  });

  it('should not display loader if loaded', () => {
    app.loaded = true;
    fixture.detectChanges();

    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('.loader')).toBeFalsy();
  });

  it('should display loader if not loaded', () => {
    app.loaded = false;
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;

    expect(compiled.querySelector('.loader')).toBeTruthy();
  });

  it('should change load property from false to true after 3000ms', fakeAsync(() => {
    const beforeExec = app.loaded;

    app.ngOnInit();
    fixture.detectChanges();
    tick(3000);
    const afterExec = app.loaded;

    expect(beforeExec).toBeFalse();
    expect(afterExec).toBeTrue();
  }));

  describe('appHeight()', () => {
    it('should be executed', () => {
      const appHeight = spyOn(app, 'appHeight');

      fixture.detectChanges();

      expect(appHeight).toHaveBeenCalled();
    });

    it('should add css varaiable of --app-height', () => {
      const appHeight = `${window.innerHeight / 16}rem`;

      fixture.detectChanges();
      const value =
        document.documentElement.style.getPropertyValue('--app-height');

      expect(value).toBe(appHeight);
    });

    it('should have been called twice on onrezie', () => {
      const appHeight = spyOn(app, 'appHeight');

      fixture.detectChanges(); // to register the event call it in ngOnInIt
      window.dispatchEvent(new Event('resize')); // trigger the event

      expect(appHeight).toHaveBeenCalledTimes(2);
    });
  });
});
