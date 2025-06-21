import {  isPlatformBrowser, NgClass, NgFor, NgIf } from '@angular/common';
import { AfterViewInit, Component, ElementRef, HostListener, Inject, OnInit, PLATFORM_ID, QueryList, Renderer2, ViewChild, viewChild, ViewChildren } from '@angular/core';
import {
  trigger,
  state,
  style,
  transition,
  animate,
  query,
  stagger
} from '@angular/animations';
import { Router, RouterModule} from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NgFor, NgIf, NgClass, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
 animations: [
    trigger('expandCollapse', [
      state('open', style({
        height: '*',
        opacity: 1,
        padding: '6px'
      })),
      state('closed', style({
        height: '0px',
        opacity: 0,
        padding: '0'
      })),
      transition('closed <=> open', [
        animate('300ms ease-in-out')
      ])
    ])
  ]
})
export class HomeComponent implements OnInit,AfterViewInit{ 
  
  @ViewChild('aboutSection') aboutSection!: ElementRef
  @ViewChild('faqSection') faqSection!: ElementRef;
faqAnimated = false;
    @ViewChild('statsSection') statsSection!: ElementRef;
statsAnimated = false;
@ViewChild('contactSection') contactSection!: ElementRef;
contactAnimated = false;


  
  isLoggedIn = false

  isScrolled = false

  mobileMenuOpen = false;

  ngOnInit(): void {
    this.checkLoginStatus()
  }
checkLoginStatus() {
  if (isPlatformBrowser(this.platformId)) {
    this.isLoggedIn = !!localStorage.getItem('loggedInUser');
  }
}

constructor(
  private router: Router,
  private renderer: Renderer2,
  @Inject(PLATFORM_ID) private platformId: Object
) {}

 
  
ngAfterViewInit(): void {
  if (isPlatformBrowser(this.platformId)) {
    this.initAboutSectionScroll();
    this.observeFAQSection(); // ✅ add observer here
       this.observeStatsSection(); //
       this.observeContactSection();
  }
}

  // About section scroll-based transform and opacity
  initAboutSectionScroll(): void {
    window.addEventListener('scroll', this.onScroll.bind(this));
  }

onScroll(): void {
  const section = this.aboutSection.nativeElement;
  const rect = section.getBoundingClientRect();
  const windowHeight = window.innerHeight;

  const scrollProgress = 1 - Math.abs((rect.top + rect.bottom - windowHeight) / (2 * windowHeight));
  const clampedProgress = Math.max(0, Math.min(1, scrollProgress));

  const img = section.querySelector('.about-img');
  const text = section.querySelector('.aboutText');

  const translateX = (1 - clampedProgress) * 100;

  this.renderer.setStyle(img, 'transform', `translateX(${-translateX}px)`);
  this.renderer.setStyle(img, 'opacity', `${clampedProgress}`);

  this.renderer.setStyle(text, 'transform', `translateX(${translateX}px)`);
  this.renderer.setStyle(text, 'opacity', `${clampedProgress}`);

  // 🎯 Fade in background when content is fully in place
  const bgOpacity = clampedProgress >= 0.98 ? 0.7 : 0;
  this.renderer.setStyle(section, 'background-color', `rgba(0, 0, 0, ${bgOpacity})`);
}
// FAQ scroll-in animation
observeFAQSection(): void {
  const section = this.faqSection.nativeElement;
  const items = section.querySelectorAll('.faq-item');

  const observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting && !this.faqAnimated) {
        items.forEach((el: any) => {
          el.classList.add('visible');
        });
        this.faqAnimated = true;
      }
    },
    { threshold: 0.3 }
  );

  observer.observe(section);
}

observeStatsSection(): void {
  if (!this.statsSection || this.statsAnimated) return;

  const section = this.statsSection.nativeElement;
  const counters = section.querySelectorAll('h2');

  const observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting && !this.statsAnimated) {
        this.statsAnimated = true;

        counters.forEach((el: HTMLElement) => {
          const targetValue = parseFloat(el.getAttribute('data-target') || '0');
          const suffix = el.getAttribute('data-suffix') || '';
          let current = 0;
          const steps = 60;
          const stepValue = targetValue / steps;
          let frame = 0;

          const updateCounter = () => {
            frame++;
            current += stepValue;
            if (frame >= steps) {
              el.innerText = `${targetValue}${suffix}`;
            } else {
              el.innerText = `${Math.round(current)}${suffix}`;
              requestAnimationFrame(updateCounter);
            }
          };

          requestAnimationFrame(updateCounter);
        });
      }
    },
    { threshold: 0.3 }
  );

  observer.observe(section);
}


observeContactSection(): void {
  if (!this.contactSection || this.contactAnimated) return;

  const section = this.contactSection.nativeElement;
  const left = section.querySelector('.contact1');
  const right = section.querySelector('.contact-form');

  const observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting && !this.contactAnimated) {
        this.contactAnimated = true;

        // Apply animations
        left.classList.add('animate-left');
        right.classList.add('animate-right');
      }
    },
    { threshold: 0.3 }
  );

  observer.observe(section);
}



  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.scrollY > 50
  }

  scrollTo(sectionId: string) {
    const element = document.getElementById(sectionId)
    if(element) {
      element.scrollIntoView({ behavior: 'smooth'})
    }
  }

  questions = [
    {question: 'What is cryptocurrency trading?', answer: 'Cryptocurrency trading involves buying and selling digital currencies like Bitcoin or Ethereum with the goal of making a profit. Prices are driven by supply, demand, and market sentiment.', open: false},
    {question: 'Is crypto trading safe?', answer: 'Crypto trading can be safe when using trusted platforms and practicing risk management. However, like any investment, it carries risks due to market volatility. Always trade responsibly.', open: false},
    {question: 'Do I need a wallet to start trading?', answer: 'Most trading platforms offer built-in wallets, so you can start trading without an external one. For long-term storage, using a private wallet is recommended for security.', open: false},
    {question: 'Can beginners start trading on your platform?', answer: 'Absolutely! Our platform is designed for all levels. We offer guides, support, and intuitive tools to help beginners trade confidently and learn as they grow.', open: false}
  ]



  toggleAnswer(index: number) {
   
      this.questions[index].open = !this.questions[index].open;
    
  }

  toggleMobileMenu() {
  this.mobileMenuOpen = !this.mobileMenuOpen;
}

closeMobileMenu() {
  this.mobileMenuOpen = false;
}


navigateAndClose(section: string) {
  this.scrollTo(section);
  this.closeMobileMenu();
}

  logout() {
    localStorage.removeItem('loggedInUser');
    this.isLoggedIn = false;
    this.router.navigate(['/main']);
  }

}
