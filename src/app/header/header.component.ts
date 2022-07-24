import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @ViewChild('nav') navBar: ElementRef<HTMLElement>;
  @ViewChild('backdrop') backdrop: ElementRef<HTMLElement>;
  social: HTMLDivElement;
  currentHash: string = location.hash;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.social = document.querySelector('.socials-cover');
    this.route.fragment.subscribe(() => {
      this.currentHash = location.hash;
    });
  }

  openNav() {
    const nav = this.navBar.nativeElement;
    const backdrop = this.backdrop.nativeElement;
    nav.style.display = 'flex';
    if (innerWidth > 375) backdrop.style.display = 'block';
    setTimeout(() => {
      nav.style.right = '0';
      backdrop.style.opacity = '1';
      this.social.setAttribute('style', 'flex-direction: row; bottom: 4rem;');
    }, 300);
  }

  closeNav() {
    const nav = this.navBar.nativeElement;
    const backdrop = this.backdrop.nativeElement;
    if (innerWidth <= 375) {
      nav.style.right = `-${375 / 16}rem`;
    } else {
      nav.style.right = `-${509 / 16}rem`;
    }

    backdrop.style.opacity = '0';
    setTimeout(() => {
      this.social.removeAttribute('style');
      nav.style.display = 'none';
      backdrop.style.display = 'none';
    }, 300);
  }
}
