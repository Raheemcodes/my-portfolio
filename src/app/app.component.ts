import { AfterContentInit, Component, OnInit } from '@angular/core';
import { SharedService } from './shared/shared.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  loaded: boolean = false;

  constructor() {}

  ngOnInit(): void {
    window.addEventListener('resize', this.appHeight);
    this.appHeight();

    setTimeout(() => {
      this.loaded = true;
    }, 3000);
  }

  appHeight() {
    const doc: HTMLElement = document.documentElement;
    doc.style.setProperty('--app-height', `${window.innerHeight / 16}rem`);
  }
}
