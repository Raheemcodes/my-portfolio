import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'web-portfolio';
  loaded: boolean = false;

  constructor() {}

  ngOnInit(): void {
  window.addEventListener('resize', this.appHeight)
  this.appHeight()

    document.body.style.overflow = 'hidden';

    setTimeout(() => {
      if (document.body.hasAttribute('style')) {
        document.body.removeAttribute('style');
      }
      this.loaded = true;
    }, 3000);
  }

  appHeight = () => {
    const doc = document.documentElement
    doc.style.setProperty('--app-height', `${window.innerHeight/16}rem`)
}
}
