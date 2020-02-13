/** Native Modules */
import { Component, ViewChild, ElementRef } from '@angular/core';

/** Custom Modules */
import { NgxSmoothScrollService, NgxSmoothScrollOption, NgxSmoothScrollDirective, NgxSmoothScrollDirectiveOption } from 'projects/ngx-smooth-scroll/src/public-api';

interface ScrollProperty {
  [key: string]: any;
  options: NgxSmoothScrollOption | NgxSmoothScrollDirectiveOption;
}


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  public basic: ScrollProperty = {
    nth: 2,
    options: {
      duration: 700,
      timingFunction: '.13, 1.07, .51, 1.29',
      alignX: 'center',
      alignY: 'center',
      stopOnArrival: false
    }
  }

  public directive: ScrollProperty = {
    wheel: true,
    keydown: true,
    mouse: !('ontouchstart' in window),
    touch: 'ontouchstart' in window,
    options: {
      duration: 500,
      timingFunction: 'ease',
      stopOnArrival: true
    },
    detectDirection: 'vertical',
    actionDirection: 'vertical',
    skip: 0,
    autoDetect: true,
    autoInterruption: false,
    animating: false
  }

  @ViewChild('basicScroll') basicScrollElRef: ElementRef;
  @ViewChild(NgxSmoothScrollDirective) smoothScrollDirective: NgxSmoothScrollDirective;

  constructor(
    private smoothScroll: NgxSmoothScrollService
  ) {}

  public basicSmoothScroll(): void {
    const { nth, options } = this.basic;

    this.smoothScroll.scrollToIndex(this.basicScrollElRef.nativeElement, '.scroll-content', nth - 1, options);
  }

  public durationLabel(duration: number): string {
    return `${ Math.floor(duration / 100) / 10 }s`;
  }

  public animationState(value: boolean): void {
    this.directive.animating = value;
  }

  public interrupt(): void {
    this.smoothScrollDirective.interrupt();
  }

}