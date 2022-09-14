import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { HeaderComponent } from './header.component';

const mockActivatedRoute = {
  fragment: new Observable((observer) => {
    observer.next(location.hash);
  }),
};

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HeaderComponent],
      providers: [{ provide: ActivatedRoute, useValue: mockActivatedRoute }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });

  describe('social field', () => {
    it('should be an element of class .socials-cover', () => {
      const compiled = fixture.debugElement.nativeElement;

      expect(compiled.querySelector('.socials-cover')).toEqual(
        component.social
      );
    });

    it('should have style.flexDirection of row 300ms after openNav() is called and innerWidth > 375', fakeAsync(() => {
      const social = component.social;

      component.openNav();
      fixture.detectChanges();
      tick(300);

      expect(social.style.flexDirection).toBe('row');
    }));

    it('should have style.bottom of 4rem 300ms after openNav() is called and innerWidth > 375', fakeAsync(() => {
      const social = component.social;

      component.openNav();
      fixture.detectChanges();
      tick(300);

      expect(social.style.bottom).toBe('4rem');
    }));

    it('should not have style attribute after openNAv() then closeNav() have been called', fakeAsync(() => {
      const social = component.social;

      component.openNav();
      component.closeNav();
      fixture.detectChanges();
      tick(300);

      expect(social.hasAttribute('style')).toBeFalse();
    }));
  });

  describe('currentHash field', () => {
    it('should have innitial value of null', async () => {
      expect(component.currentHash).toBe(location.hash);
    });

    it('should be subscribed route[fragment]', async () => {
      location.hash = '#projects-sect';
      component.ngOnInit();

      fixture.detectChanges();

      expect(component.currentHash).toBe(location.hash);
    });
  });

  describe('nav field', () => {
    it('should have classname with no style attribute initially', () => {
      const nav = component.navBar;

      expect(nav.nativeElement.className).toBe('nav-bar');
      expect(nav.nativeElement.style.display).toBeFalsy();
    });

    it('should have style.display of flex 300ms after openNav() is called', fakeAsync(() => {
      const nav = component.navBar;

      component.openNav();
      fixture.detectChanges();
      tick(300);

      expect(nav.nativeElement.style.display).toBe('flex');
    }));

    it('should have style.right of 0 300ms after openNav() is called', fakeAsync(() => {
      const nav = component.navBar;

      component.openNav();
      fixture.detectChanges();
      tick(300);

      expect(nav.nativeElement.style.right).toBe('0px');
    }));

    it('should have style.display of none 300ms after closeNav() is called', fakeAsync(() => {
      const nav = component.navBar;

      component.closeNav();
      fixture.detectChanges();
      tick(300);

      expect(nav.nativeElement.style.display).toBe('none');
    }));

    it('should have style.right of -375px|-509px in rem 300ms after closeNav() is called', fakeAsync(() => {
      const nav = component.navBar;

      component.closeNav();
      fixture.detectChanges();
      tick(300);

      if (innerWidth <= 375) {
        expect(nav.nativeElement.style.right).toBe(`${-375 / 16}rem`);
      } else {
        expect(nav.nativeElement.style.right).toBe(`${-509 / 16}rem`);
      }
    }));
  });

  describe('backdrop field', () => {
    it('should have classname with no style attribute initially', () => {
      const backdrop = component.backdrop;

      expect(backdrop.nativeElement.className).toEqual('backdrop');
      expect(backdrop.nativeElement.style.display).toBeFalsy();
    });

    it('should have style.display of block 300ms after openNav() is called and innerWidth > 375', fakeAsync(() => {
      const backdrop = component.backdrop;
      innerWidth = 376;

      component.openNav();
      fixture.detectChanges();
      tick(300);

      expect(backdrop.nativeElement.style.display).toBe('block');
    }));

    it('should have style.opacity of 0 300ms after openNav() is called and innerWidth > 375', fakeAsync(() => {
      const backdrop = component.backdrop;

      component.openNav();
      fixture.detectChanges();
      tick(300);

      expect(backdrop.nativeElement.style.opacity).toBe('1');
    }));

    it('should not have style attribute 300ms after openNav() is called and innerWidth <= 375', fakeAsync(() => {
      const backdrop = component.backdrop;
      innerWidth = 374;

      component.openNav();
      fixture.detectChanges();
      tick(300);

      expect(backdrop.nativeElement.style.display).toBeFalsy();
    }));

    it('should have style.display of none 300ms after closeNav() is called', fakeAsync(() => {
      const backdrop = component.backdrop;

      component.closeNav();
      fixture.detectChanges();
      tick(300);

      expect(backdrop.nativeElement.style.display).toBe('none');
    }));

    it('should have style.opacity of 0 after closeNav() is called', () => {
      const backdrop = component.backdrop;

      component.closeNav();
      fixture.detectChanges();

      expect(backdrop.nativeElement.style.opacity).toBe('0');
    });
  });
});
