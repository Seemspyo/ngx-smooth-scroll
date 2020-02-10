/** Native Modules */
import { Component, ViewChild, ElementRef } from '@angular/core';

/** Custom Modules */
import { NgxSmoothScrollService, NgxSmoothScrollOption } from 'projects/ngx-smooth-scroll/src/public-api';
import { NgxSmoothScrollKeyboardDirective } from 'projects/ngx-smooth-scroll/src/lib/ngx-smooth-scroll-keyboard.directive';
import { NgxSmoothScrollWheelDirective } from 'projects/ngx-smooth-scroll/src/lib/ngx-smooth-scroll-wheel.directive';

interface ScrollVariables {
  enabled: boolean;
  options: NgxSmoothScrollOption;
  direction: 'vertical' | 'horizontal';
  skip: number;
  [key: string]: any;
}


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  public basic: { nth: number; options: NgxSmoothScrollOption } = {
    nth: 2,
    options: {
      duration: 700,
      timingFunction: '.13, 1.07, .51, 1.29',
      alignX: 'center',
      alignY: 'center'
    }
  }

  public wheel: ScrollVariables = {
    enabled: true,
    options: {
      duration: 500,
      timingFunction: 'ease'
    },
    direction: 'vertical',
    skip: 0,
    animating: false
  }

  public keyboard: ScrollVariables = {
    enabled: true,
    options: {
      duration: 500,
      timingFunction: 'ease'
    },
    direction: 'vertical',
    skip: 0,
    animating: false
  }

  @ViewChild('basicScroll', { static: false }) basicScrollElRef: ElementRef;
  @ViewChild(NgxSmoothScrollKeyboardDirective, { static: false }) keyboardDirectiveRef: NgxSmoothScrollKeyboardDirective;
  @ViewChild(NgxSmoothScrollWheelDirective, { static: false }) wheelDirectiveRef: NgxSmoothScrollWheelDirective;

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

  public animationState(type: string, value: boolean): void {
    this[type].animating = value;
  }

  public interrupt(type: string): void {
    switch (type) {
      case 'keyboard':
        this.keyboardDirectiveRef.interrupt();
        break;
      case 'wheel':
        this.wheelDirectiveRef.interrupt();
        break;
    }
  }

}