/** Native Modules */
import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Subscription } from 'rxjs';

/** Types */
import { NgxSmoothScrollOption } from 'ngx-smooth-scroll';

/** Services */
import { NgxSmoothScrollService } from 'ngx-smooth-scroll';

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
export class AppComponent implements OnInit, OnDestroy {

  private subscriptions: Array<Subscription> = []

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
    skip: 1
  }

  public keyboard: ScrollVariables = {
    enabled: true,
    options: {
      duration: 500,
      timingFunction: 'ease'
    },
    direction: 'vertical',
    skip: 1
  }

  @ViewChild('basicScroll', { static: false }) basicScrollElRef: ElementRef;

  constructor(
    private smoothScroll: NgxSmoothScrollService
  ) {}

  ngOnInit() {
  }

  ngOnDestroy() {
    for (const subscription of this.subscriptions) subscription.unsubscribe();
  }

  public basicSmoothScroll(): void {
    const { nth, options } = this.basic;

    this.smoothScroll.scrollToIndex(this.basicScrollElRef.nativeElement, '.scroll-content', nth - 1, options);
  }

  public durationLabel(duration: number): string {
    return `${ Math.floor(duration / 100) / 10 }s`;
  }

}