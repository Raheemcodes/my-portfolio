import { Router } from '@angular/router';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { SharedService } from '../shared/shared.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  @ViewChild('image') introImg: ElementRef<HTMLImageElement>;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.changeUrl();
    document.onscroll = this.changeUrl.bind(this);
  }

  changeUrl() {
    const homeSect = document.getElementById('home-sect');
    const aboutSect = document.getElementById('about-sect');
    const skillseSect = document.getElementById('skills-sect');
    const projectsSect = document.getElementById('projects-sect');
    const contactSect = document.getElementById('contact-sect');

    if (location.pathname == '/') {
      if (scrollY >= 0 && scrollY < homeSect.clientHeight) {
        this.router.navigate(['/']);
      } else if (
        scrollY >= homeSect.clientHeight &&
        scrollY < homeSect.clientHeight + aboutSect.clientHeight
      ) {
        this.router.navigate([''], { fragment: 'about-sect' });
      } else if (
        scrollY >= homeSect.clientHeight + aboutSect.clientHeight &&
        scrollY <
          homeSect.clientHeight +
            aboutSect.clientHeight +
            skillseSect.clientHeight
      ) {
        this.router.navigate([''], { fragment: 'skills-sect' });
      } else if (
        scrollY >=
          homeSect.clientHeight +
            aboutSect.clientHeight +
            skillseSect.clientHeight &&
        scrollY <
          homeSect.clientHeight +
            aboutSect.clientHeight +
            skillseSect.clientHeight +
            projectsSect.clientHeight
      ) {
        this.router.navigate([''], { fragment: 'projects-sect' });
      } else if (
        scrollY >=
          homeSect.clientHeight +
            aboutSect.clientHeight +
            skillseSect.clientHeight +
            projectsSect.clientHeight &&
        scrollY <
          homeSect.clientHeight +
            aboutSect.clientHeight +
            skillseSect.clientHeight +
            projectsSect.clientHeight +
            contactSect.clientHeight
      ) {
        this.router.navigate([''], { fragment: 'contact-sect' });
      }
    }
  }
}
