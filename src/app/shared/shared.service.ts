import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  constructor() {}

  lazyLoading() {
    let lazyloadImages;

    if ('IntersectionObserver' in window) {
      lazyloadImages = document.querySelectorAll('.lazy');
      const imageObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const image = entry.target as any;
              image.src = image.dataset.src;
              image.alt = image.dataset.alt;
              image.classList.remove('lazy');
              imageObserver.unobserve(image);
            }
          });
        },
        {
          rootMargin: '0px 0px 200px 0px',
        }
      );

      lazyloadImages.forEach((image) => {
        imageObserver.observe(image);
      });
    } else {
      let lazyloadThrottleTimeout;
      lazyloadImages = document.querySelectorAll('.lazy');

      function lazyload() {
        if (lazyloadThrottleTimeout) {
          clearTimeout(lazyloadThrottleTimeout);
        }

        lazyloadThrottleTimeout = setTimeout(() => {
          const scrollTop = window.pageYOffset;
          lazyloadImages.forEach((img) => {
            if (img.offsetTop < window.innerHeight + scrollTop + 200) {
              img.src = img.dataset.src;
              img.alt = img.dataset.alt;
              img.classList.remove('lazy');
            }
          });
          if (lazyloadImages.length == 0) {
            document.removeEventListener('scroll', lazyload);
            window.removeEventListener('resize', lazyload);
            window.removeEventListener('orientationChange', lazyload);
          }
        }, 20);
      }

      document.addEventListener('scroll', lazyload);
      window.addEventListener('resize', lazyload);
      window.addEventListener('orientationChange', lazyload);
    }
  }
}
