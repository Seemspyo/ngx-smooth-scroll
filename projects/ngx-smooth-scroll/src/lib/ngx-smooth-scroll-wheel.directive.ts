/** Native Modules */
import { Directive, Input, AfterViewInit, OnChanges, OnDestroy, SimpleChanges, ElementRef, Renderer2 } from '@angular/core';

/** Custom Modules */
import { NgxSmoothScroll } from './helpers/smooth-scroll.helper';
import { IndexDetector } from './helpers/index-detector.helper';

/** Types */
import { NgxSmoothScrollOption } from './@types';


@Directive({
  selector: '[ngxSmoothScrollWheel]',
  exportAs: 'ngxSmoothScrollWheel'
})
export class NgxSmoothScrollWheelDirective implements AfterViewInit, OnChanges, OnDestroy {

  @Input('child-selector') childSelector?: string;
  @Input() enable: boolean;
  @Input() skip: number;
  @Input() direction: 'horizontal' | 'vertical';
  @Input() options: NgxSmoothScrollOption;

  private events: Array<() => void>;
  private enabled: boolean = false;
  private smooth: NgxSmoothScroll;
  private indexDetector: IndexDetector;
  private animating: boolean;

  constructor(
    private containerElRef: ElementRef,
    private renderer: Renderer2
  ) {}

  ngAfterViewInit() {
    if (this.enable && !this.enabled) this.init();
  }

  ngOnChanges(changes: SimpleChanges) {
    const enable = changes.enable;

    if (enable && !enable.isFirstChange() && enable.previousValue !== enable.currentValue) {
      switch (enable.currentValue) {
        case true:
          this.init();
          break;
        case false:
          this.destroy();
          break;
      }
    }
  }

  ngOnDestroy() {
    if (this.enabled) this.destroy();
  }

  public get containerEl(): HTMLElement {
    return this.containerElRef.nativeElement;
  }

  public get children(): Array<HTMLElement> {
    return this.childSelector && Array.from(this.containerEl.querySelectorAll(this.childSelector));
  }

  private init(): void {
    this.events = new Array();
    this.smooth = new NgxSmoothScroll(this.containerEl);
    this.indexDetector = new IndexDetector(this.containerEl);

    this.events.push(
      this.renderer.listen(this.containerEl, 'wheel', e => { this.onWheel(e); })
    );

    this.enabled = true;
  }

  private destroy(): void {
    for (const remove of this.events) remove();

    this.events = null;
    this.smooth = null;
    this.indexDetector = null;
    this.enabled = false;
  }

  private async onWheel(event: WheelEvent): Promise<void> {
    event.preventDefault();

    if (this.animating) return;

    this.animating = true;

    const children = this.children;
    if (children) {
      const
      direction = Math.sign(event.deltaY),
      currentIndex = this.currentIndex,
      skip = typeof this.skip === 'number' ? this.skip : 1,
      index = Math.max(0, Math.min(children.length - 1, currentIndex + (direction * skip)));

      await this.smooth.scrollToElement(children[index], this.options).toPromise();

      this.animating = false;
    }
  }

  private get heading(): 'horizontal' | 'vertical' {
    return this.direction || 'vertical';
  }

  private get currentIndex(): number {
    switch (this.heading) {
      case 'vertical':
        return this.indexDetector.detectY(this.children);
      case 'horizontal':
        return this.indexDetector.detectX(this.children);
    }
  }

}
