import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ProjectComponent } from './project.component';

const mockMouse = {
  preventDefault() {},
  type: 'mouse',
  pageX: 130,
  pageY: 120,
} as MouseEvent;

const fMockMouse = {
  preventDefault() {},
  type: 'mouse',
  pageX: 100,
  pageY: 130,
} as MouseEvent;

const mockTouch = {
  preventDefault() {},
  type: 'touch',
  touches: [{ clientX: 140, clientY: 150 }],
} as unknown as TouchEvent;

describe('ProjectComponent', () => {
  let component: ProjectComponent;
  let fixture: ComponentFixture<ProjectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProjectComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe('before initialization', () => {
    it('slider | progressBar | threshold should be undefined', () => {
      expect(component.slider).toBeUndefined();
      expect(component.progressBar).toBeUndefined();
      expect(component.threshold).toBeUndefined();
    });

    it('projectContent should be an array of length 4', () => {
      expect(component.projectContent.length).toBe(4);
    });

    it('screenWidth should be yeild value of screen size', () => {
      expect(component.screenWidth).toBe(innerWidth);
    });

    it('isDragging should be yeild value of false', () => {
      expect(component.isDragging).toBeFalse();
    });

    it('startPos | startPosY | currentIndex | currentIndex should be yeild value of 0', () => {
      expect(component.startPos).toBe(0);
      expect(component.startPosY).toBe(0);
      expect(component.prevTranslate).toBe(0);
      expect(component.currentIndex).toBe(0);
    });

    it('lastSlide should be index of the last element in projectsContent[]', () => {
      expect(component.lastSlide).toBe(component.projectContent.length - 1);
    });

    it('showStyle to be yeild value true', () => {
      expect(component.showStyle).toBeTrue();
    });
  });

  describe('after initialization', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('slider should reference a rendered element', () => {
      const compiled = fixture.debugElement.query(By.css('.projects-wrapper'));

      expect(component.slider.nativeElement).toEqual(compiled.nativeElement);
    });

    it('progressBar should reference a rendered element if screenWidth >= 768', () => {
      component.screenWidth = 900;
      fixture.detectChanges();
      const compiled =
        fixture.debugElement.nativeElement.querySelector('.progress-bar');

      expect(component.progressBar.nativeElement).toBe(compiled);
    });

    it('progressBar should be undefined if screenWidth < 768', () => {
      component.screenWidth = 767;
      fixture.detectChanges();

      expect(component.progressBar).toBeUndefined();
    });

    it('screenWidth should change on resize', () => {
      innerWidth = 300;

      window.dispatchEvent(new Event('resize'));

      expect(component.screenWidth).toBe(300);
    });

    it('threshold should be the width of the slider parent', () => {
      const parent = fixture.debugElement.query(By.css('.projects-content'));

      expect(component.threshold).toBe(parent.nativeElement.clientWidth);
    });
  });

  describe('showLess()', () => {
    it('should yeild string of length 183 if argument of length > 183', () => {
      const text = component.projectContent[3];

      const result = component.showLess(text);

      expect(result.length).toBe(167);
    });

    it('should yeild same string of argument passed if its of length <= 183', () => {
      const text = component.projectContent[2];

      const result = component.showLess(text);

      expect(result).toBe(text);
    });
  });

  describe('showMore()', () => {
    it('should yeild same string of argument passed if its of length > 183', () => {
      const text = component.projectContent[3];

      const result = component.showMore(text);

      expect(result).toBe(text);
    });

    it('should yeild value null passed argument length <= 183', () => {
      const text = component.projectContent[2];

      const result = component.showMore(text);

      expect(result).toBeNull();
    });
  });

  describe('getPositionX()', () => {
    it('should yeild number(s) if a TouchEvent argument is passed', () => {
      const result = component.getPositionX(mockTouch);

      expect(result).toBe(140);
    });

    it('should yeild number(s) if a MouseEvent argument is passed', () => {
      const result = component.getPositionX(mockMouse);

      expect(result).toBe(130);
    });
  });

  describe('getPositionY()', () => {
    it('should yeild number(s) if a TouchEvent argument is passed', () => {
      const result = component.getPositionY(mockTouch);

      expect(result).toBe(150);
    });

    it('should yeild number(s) if a MouseEvent argument is passed', () => {
      const result = component.getPositionY(mockMouse);

      expect(result).toBe(120);
    });
  });

  describe('onTouchStart()', () => {
    beforeEach(() => {
      fixture.detectChanges();
      innerWidth = 768;
    });

    it('should be called on touchstart | mousedown', () => {
      const touchstart = spyOn(component, 'onTouchStart');
      const compiled = fixture.debugElement.query(
        By.css('.project')
      ).nativeElement;

      compiled.dispatchEvent(new Event('touchstart'));
      compiled.dispatchEvent(new Event('mousedown'));

      fixture.detectChanges();

      expect(touchstart).toHaveBeenCalledTimes(2);
    });

    it('slider should be style.transition of none', () => {
      const slider = fixture.debugElement.query(
        By.css('.projects-wrapper')
      ).nativeElement;
      component.onTouchStart(mockMouse, 2);

      expect(slider.style.transition).toEqual('none 0s ease 0s');
    });

    it('getPositionX() should be called', () => {
      const getPosition = spyOn(component, 'getPositionX');
      component.onTouchStart(mockMouse, 3);

      expect(getPosition).toHaveBeenCalled();
    });

    it('getPositionY() should be called', () => {
      const getPosition = spyOn(component, 'getPositionY');
      component.onTouchStart(mockMouse, 3);

      expect(getPosition).toHaveBeenCalled();
    });

    it('isDragging should yeild true', () => {
      component.onTouchStart(mockMouse, 3);

      const isDragging = component.isDragging;

      expect(isDragging).toBeTrue();
    });

    it('slider should include classname grabbing', () => {
      const slider = fixture.debugElement.query(By.css('.projects-wrapper'));
      component.onTouchStart(mockMouse, 2);

      expect(slider.classes['grabbing']).toBeTrue();
    });
  });

  describe('touchmove()', () => {
    it('should be called on touchmove | mousemove', () => {
      const touchmove = spyOn(component, 'onTouchMove');
      fixture.detectChanges();

      const compiled = fixture.debugElement.query(
        By.css('.project')
      ).nativeElement;
      compiled.dispatchEvent(new Event('touchmove'));
      compiled.dispatchEvent(new Event('mousemove'));

      expect(touchmove).toHaveBeenCalledTimes(2);
    });

    it('getPositionX() | getPositionY() should be called', () => {
      const getPositionX = spyOn(component, 'getPositionX');
      const getPositionY = spyOn(component, 'getPositionY');
      component.isDragging = true;
      component.onTouchMove(mockMouse);

      expect(getPositionX).toHaveBeenCalled();
      expect(getPositionY).toHaveBeenCalled();
    });

    it('setSliderPosition() should be called if currentTranslateX > currentTranslateY absolutely', () => {
      const sliderPostion = spyOn(component, 'setSliderPosition');
      component.isDragging = true;

      component.onTouchMove(mockMouse);

      expect(sliderPostion).toHaveBeenCalled();
    });

    it('setSliderPosition() should be called if currentTranslateX < currentTranslateY absolutely', () => {
      const sliderPostion = spyOn(component, 'setSliderPosition');
      component.isDragging = true;

      component.onTouchMove(fMockMouse);

      expect(sliderPostion).not.toHaveBeenCalled();
    });
  });

  describe('onTouchEnd()', () => {
    it('should be called on touchend | mouseup', () => {
      const touchend = spyOn(component, 'onTouchEnd');
      const compiled = fixture.debugElement.query(
        By.css('.project')
      ).nativeElement;

      fixture.detectChanges();

      compiled.dispatchEvent(new Event('touchend'));
      compiled.dispatchEvent(new Event('mouseup'));

      expect(touchend).toHaveBeenCalledTimes(2);
    });

    it('isDragging should yeild false', () => {
      fixture.detectChanges();
      component.onTouchEnd();
      expect(component.isDragging).toBeFalse();
    });

    it('currentIndex should increase if swiped right', () => {
      component.currentIndex = 1;
      component.currentTranslate = -300;
      fixture.detectChanges();
      component.onTouchEnd();

      expect(component.currentIndex).withContext(' < 1/4 -threshold').toBe(2);
    });

    it('currentIndex should decrease if swiped left', () => {
      component.currentIndex = 1;
      component.currentTranslate = 300;
      fixture.detectChanges();
      component.onTouchEnd();

      expect(component.currentIndex).withContext(' > 1/4 threshold').toBe(0);
    });

    it('currentIndex should be constant if swiped left | right', () => {
      component.currentIndex = 1;
      component.currentTranslate = 0;
      fixture.detectChanges();
      component.onTouchEnd();

      expect(component.currentIndex)
        .withContext('not: > 1/4 threshold | < 1/4 -theshold')
        .toBe(1);
    });

    it('setPositionByIndex() should be invoked', () => {
      fixture.detectChanges();
      const setPositionByIndex = spyOn(component, 'setPositionByIndex');

      component.onTouchEnd();
      expect(setPositionByIndex).toHaveBeenCalled();
    });

    it('slider should not to have .grabbing', () => {
      fixture.detectChanges();
      const slider = fixture.debugElement.query(By.css('.projects-wrapper'));
      component.onTouchEnd();

      expect(slider.classes['grabbing']).toBeFalsy();
    });
  });

  describe('slideRight()', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should be called', () => {
      location.hash = '#projects-sect';
      const slideRight = spyOn(component, 'slideRight');

      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));

      expect(slideRight)
        .withContext('if projects | skills sect')
        .toHaveBeenCalled();
    });

    it('should not be called', () => {
      location.hash = '#home-sect';
      const slideRight = spyOn(component, 'slideRight');

      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));

      expect(slideRight)
        .withContext('if not projects | skills sect')
        .not.toHaveBeenCalled();
    });

    it('currentIndex should increase', () => {
      component.currentIndex = 1;
      component.lastSlide = 3;

      component.slideRight();

      expect(component.currentIndex)
        .withContext('if it is < last slide index')
        .toBe(2);
    });

    it('currentIndex should be constanst', () => {
      component.currentIndex = 3;
      component.lastSlide = 3;

      component.slideRight();

      expect(component.currentIndex)
        .withContext('if it is >= last slide index')
        .toBe(3);
    });

    it('setPositionByIndex() should be called', () => {
      component.currentIndex = 1;
      component.lastSlide = 3;
      const setPositionByIndex = spyOn(component, 'setPositionByIndex');

      component.slideRight();

      expect(setPositionByIndex)
        .withContext('if it is < last slide index')
        .toHaveBeenCalled();
    });

    it('setPositionByIndex() should not be called', () => {
      component.currentIndex = 3;
      component.lastSlide = 3;
      const setPositionByIndex = spyOn(component, 'setPositionByIndex');

      component.slideRight();

      expect(setPositionByIndex)
        .withContext('if it is >= last slide index')
        .not.toHaveBeenCalled();
    });
  });

  describe('slideLeft()', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should be called', () => {
      location.hash = '#projects-sect';
      const slideLeft = spyOn(component, 'slideLeft');

      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }));

      expect(slideLeft)
        .withContext('if projects | skills sect')
        .toHaveBeenCalled();
    });

    it('should not be called', () => {
      location.hash = '#home-sect';
      const slideLeft = spyOn(component, 'slideLeft');

      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }));

      expect(slideLeft)
        .withContext('if not projects | skills sect')
        .not.toHaveBeenCalled();
    });

    it('currentIndex should decrease', () => {
      component.currentIndex = 1;

      component.slideLeft();

      expect(component.currentIndex).withContext('if it is > 0').toBe(0);
    });

    it('currentIndex should be constanst', () => {
      component.currentIndex = 0;

      component.slideLeft();

      expect(component.currentIndex).withContext('if it is <= 0').toBe(0);
    });

    it('should call setPositionByIndex()', () => {
      component.currentIndex = 1;
      const setPositionByIndex = spyOn(component, 'setPositionByIndex');

      component.slideLeft();

      expect(setPositionByIndex).withContext('if it is > 0').toHaveBeenCalled();
    });

    it('should call setPositionByIndex()', () => {
      component.currentIndex = 0;
      const setPositionByIndex = spyOn(component, 'setPositionByIndex');

      component.slideLeft();

      expect(setPositionByIndex)
        .withContext('if it is <= 0')
        .not.toHaveBeenCalled();
    });
  });

  describe('setPositionByIndex()', () => {
    beforeEach(() => {
      fixture.detectChanges();
      innerWidth = 768;
    });

    it('should call setSliderPosition()', () => {
      const setSliderPosition = spyOn(component, 'setSliderPosition');
      component.setPositionByIndex();

      expect(setSliderPosition).toHaveBeenCalled();
    });

    it('currentTranslate should be 0', () => {
      innerWidth = 767;
      component.setPositionByIndex();

      expect(component.currentTranslate)
        .withContext('if innerwidth < 768px')
        .toBe(0);
    });

    it('threshold should be 1/4 of the slider width', () => {
      const slider = fixture.debugElement.query(By.css('.projects-wrapper'));
      component.setPositionByIndex();
      expect(component.threshold).toBe(slider.nativeElement.clientWidth / 4);
    });

    it('currentTranslate should be 0', () => {
      component.currentIndex = 0;
      const currentIndex = component.currentIndex;

      component.setPositionByIndex();
      const threshold = component.threshold;

      expect(component.currentTranslate)
        .withContext('if curIdx is 0')
        .toBe(currentIndex * -threshold);
    });

    it('currentTranslate should be < 0', () => {
      component.currentIndex = 1;
      const currentIndex = component.currentIndex;

      component.setPositionByIndex();
      const threshold = component.threshold;
      expect(component.currentTranslate)
        .withContext('if 0 < curIdx < 3')
        .toBe(currentIndex * -threshold - -threshold * 0.05);
    });

    it('currentTranslate should be < 0', () => {
      component.currentIndex = 3;
      const currentIndex = component.currentIndex;

      component.setPositionByIndex();
      const threshold = component.threshold;
      expect(component.currentTranslate)
        .withContext('if curIdx is 3')
        .toBe(currentIndex * -threshold - -threshold * 0.1);
    });

    it('prevTranslate should be currentTranslate', () => {
      component.setPositionByIndex();
      expect(component.prevTranslate).toBe(component.currentTranslate);
    });

    it('prevTranslate should not be currentTranslate', () => {
      innerWidth = 767;
      component.currentTranslate = -300;
      component.prevTranslate = -400;

      component.setPositionByIndex();
      expect(component.prevTranslate)
        .withContext('innerWidth suddenly < 768')
        .not.toBe(component.currentTranslate);
    });

    it('should increase pagination', () => {
      component.screenWidth = 768;
      component.currentIndex = 1;
      const progressBar = fixture.debugElement.query(By.css('.progress-bar'));
      component.progressBar = progressBar;

      const pagination = progressBar.nativeElement.firstElementChild;

      component.setPositionByIndex();
      fixture.detectChanges();
      expect(pagination.style.width).toBe(`${25 * 2}%`);
    });
  });

  describe('setSliderPosition()', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('slider element should', () => {
      const compiled = fixture.debugElement.query(By.css('.projects-wrapper'));
      component.currentTranslate = -300;

      component.setSliderPosition();

      expect(compiled.styles['transition'])
        .withContext('have style.transition attribute')
        .toBe('transform 0.3s ease-out 0s');

      expect(compiled.styles['transform'])
        .withContext('have style.transform attribute')
        .toBe(`translateX(${component.currentTranslate}px)`);
    });
  });
});
