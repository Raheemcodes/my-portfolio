import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss'],
})
export class ProjectComponent implements OnInit, AfterViewInit {
  @Output() slideTranslated = new EventEmitter<number>();
  @ViewChild('slide') slider: ElementRef<HTMLDivElement>;
  @ViewChild('pagination') progressBar: ElementRef<HTMLDivElement>;
  projectContent: string[] = [
    'Money-Mine is a personal project of mine. I started off with this project while trying to get accustomed to vanilla CSS and JavaScript. Money-Mine is an affilate marketing platform.',
    'Created to get myself familiar with the intricacies of NodeJS and its framework, ExpressJS, Ibeemay Mobile Store is an E-Commerce web application for handling mobile phone purchase. It integrates Stripe payment gateway for (test) payments.',
    'The RoyaleBiba Makeup store is a PWA (Progressive Web App) i created to buff up my angular framework skills. It is rendered from the server side and connected to a RestAPI',
    'The Attendance management system uses both password and password-less authentication (JavaScript webauthnAPI was used for its passwordless authentication); also GPS protection where necessary. The application was developed with Angular (Frontend), ExpressJS (Backend) and MongoDB (Database).',
  ];

  screenWidth: number = innerWidth;
  threshold: number;
  isDragging: boolean = false;
  startPos: number = 0;
  startPosY: number = 0;
  currentTranslate: number = 0;
  prevTranslate: number = 0;
  currentIndex: number = 0;
  lastSlide: number = 3;
  showStyle: boolean = true;

  constructor() {}

  ngOnInit(): void {}

  showLess(text: string): string {
    return text.length > 183 ? text.slice(0, 165).trim() + '...' : text;
  }

  showMore(text: string): string {
    return text.length > 183 ? text : null;
  }

  ngAfterViewInit(): void {
    this.threshold = this.slider.nativeElement.parentElement.clientWidth;
    window.addEventListener('resize', this.setPositionByIndex.bind(this));
    Array.from(this.slider.nativeElement.children).forEach(
      (el: HTMLElement, index: number) => {
        el.addEventListener('dragstart', (e) => e.preventDefault(), {
          passive: false,
        });
        // touch events
        el.addEventListener('touchstart', (e) => this.onTouchStart(e, index), {
          passive: false,
        });
        el.addEventListener('touchend', this.onTouchEnd.bind(this), {
          passive: false,
        });
        el.addEventListener('touchmove', this.onTouchMove.bind(this), {
          passive: false,
        });
        // mouse events
        el.addEventListener('mousedown', (e) => this.onTouchStart(e, index), {
          passive: false,
        });
        el.addEventListener('mouseup', this.onTouchEnd.bind(this), {
          passive: false,
        });
        el.addEventListener('mousemove', this.onTouchMove.bind(this), {
          passive: false,
        });
        el.addEventListener('mouseleave', this.onTouchEnd.bind(this), {
          passive: false,
        });
      }
    );

    window.addEventListener('keydown', (e: KeyboardEvent) => {
      if (
        location.hash == '#projects-sect' ||
        location.hash == '#skills-sect'
      ) {
        if (e.key == 'ArrowRight') this.slideRight();
        if (e.key == 'ArrowLeft') this.slideLeft();
      }
    });
  }

  onSlideTranslate(data: number) {
    this.slideTranslated.emit(data);
  }

  getPositionX(event: any) {
    return event.type.includes('mouse')
      ? event.pageX
      : event.touches[0].clientX;
  }

  getPositionY(event: any) {
    return event.type.includes('mouse')
      ? event.pageY
      : event.touches[0].clientY;
  }

  onTouchStart(e: any, idx: number) {
    if (innerWidth < 768) return;
    this.slider.nativeElement.style.transition = 'none';
    this.currentIndex = idx;
    this.startPos = this.getPositionX(e);
    this.startPosY = this.getPositionY(e);
    this.isDragging = true;
    this.slider.nativeElement.classList.add('grabbing');
  }

  onTouchMove(e: any) {
    if (this.isDragging) {
      const currentPosition = this.getPositionX(e);
      const currentTranslateX = this.getPositionX(e) - this.startPos;
      const currentTranslateY = this.getPositionY(e) - this.startPosY;

      if (Math.abs(currentTranslateY) < Math.abs(currentTranslateX)) {
        if (e.cancelable) e.preventDefault();
        this.currentTranslate =
          this.prevTranslate + currentPosition - this.startPos;
        this.setSliderPosition();
      }
    }
  }

  onTouchEnd() {
    this.isDragging = false;

    const movedBy = this.currentTranslate - this.prevTranslate;
    // if moved enough negative then snap to next slide if there is one

    if (
      movedBy < -this.threshold / 4 &&
      this.currentIndex < this.slider.nativeElement.children.length - 1
    )
      this.currentIndex++;

    // if moved enough positive then snap to previous slide if there is one
    if (movedBy > this.threshold / 4 && this.currentIndex > 0)
      this.currentIndex--;

    this.setPositionByIndex();

    this.slider.nativeElement.classList.remove('grabbing');
  }

  slideLeft() {
    if (this.currentIndex == 0) return;
    this.currentIndex--;
    this.setPositionByIndex();
  }

  slideRight() {
    if (this.currentIndex == this.lastSlide) return;
    this.currentIndex++;
    this.setPositionByIndex();
  }

  setSliderPosition() {
    this.slider.nativeElement.style.transition = 'transform 0.3s ease-out';
    this.slider.nativeElement.style.transform = `translateX(${this.currentTranslate}px)`;
  }

  setPositionByIndex() {
    this.threshold = this.slider.nativeElement.clientWidth / 4;
    if (this.currentIndex == 0) {
      this.currentTranslate = this.currentIndex * -this.threshold;
    }
    if (this.currentIndex > 0 && this.currentIndex < 3) {
      this.currentTranslate =
        this.currentIndex * -this.threshold - -this.threshold * 0.05;
    }
    if (this.currentIndex == 3) {
      this.currentTranslate =
        this.currentIndex * -this.threshold - -this.threshold * 0.1;
    }
    if (innerWidth < 768) {
      this.currentIndex = 0;
      this.currentTranslate = 0;
    }
    this.prevTranslate = this.currentTranslate;
    this.progressBar.nativeElement.firstElementChild.setAttribute(
      'style',
      `width: ${25 * (this.currentIndex + 1)}%`
    );
    this.setSliderPosition();
  }
}
