/** Native Modules */
import { Directive, AfterViewInit, OnChanges, OnDestroy, Input, SimpleChanges, ElementRef, Renderer2, Output, EventEmitter } from '@angular/core';

/** Custom Modules */
import { NgxSmoothScroll } from './core/smooth-scroll.core';
import { IndexDetector } from './core/index-detector.core';

/** Types */
import { NgxSmoothScrollOption, NgxSmoothScrollKeyCodeMap, NgxSmoothScrollBeforeAnimateEvent, NgxSmoothScrollAfterAnimateEvent } from './@types';


@Directive({
  selector: '[ngxSmoothScrollKeyboard]',
  exportAs: 'ngxSmoothScrollKeyboard'
})
export class NgxSmoothScrollKeyboardDirective implements AfterViewInit, OnChanges, OnDestroy {

  @Input('child-selector') childSelector?: string;
  @Input('keyCode') keyCodeMap: NgxSmoothScrollKeyCodeMap;
  @Input() enable: boolean;
  @Input() skip: number;
  @Input() direction: 'horizontal' | 'vertical';
  @Input() options: NgxSmoothScrollOption;

  @Output() beforeAnimate: EventEmitter<NgxSmoothScrollBeforeAnimateEvent> = new EventEmitter();
  @Output() afterAnimate: EventEmitter<NgxSmoothScrollAfterAnimateEvent> = new EventEmitter();

  private events: Array<() => void>;
  private enabled: boolean = false;
  private smooth: NgxSmoothScroll;
  private indexDetector: IndexDetector;
  private animating: boolean;
  private interrupted: boolean = false;

  constructor(
    private containerElRef: ElementRef,
    private renderer: Renderer2
  ) { }

  ngAfterViewInit() {
    if (typeof this.enable !== 'boolean') this.enable = true;
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

  public interrupt(): boolean {
    return this.smooth.interrupt();
  }

  private init(): void {
    if (!this.keyCodeMap) this.keyCodeMap = new Map([
      [ 'normal', [40, 39, 83, 68] ],
      [ 'reverse', [38, 37, 87, 65] ]
    ]);
    if (!this.containerEl.hasAttribute('tabindex')) this.renderer.setAttribute(this.containerEl, 'tabindex', '0');
    this.renderer.setStyle(this.containerEl, 'outline', 'none');

    this.events = new Array();
    this.smooth = new NgxSmoothScroll(this.containerEl);
    this.indexDetector = new IndexDetector(this.containerEl);

    this.events.push(
      this.renderer.listen(this.containerEl, 'keydown', e => { this.onKeydown(e); })
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

  private async onKeydown(event: KeyboardEvent): Promise<void> {
    event.preventDefault();
    if (this.animating) return;

    let direction: number;

    switch (true) {
      case this.keyCodeMap.get('normal').includes(event.keyCode):
        direction = 1;
        break;
      case this.keyCodeMap.get('reverse').includes(event.keyCode):
        direction = -1;
        break;
      default:
        return;
    }

    this.animating = true;

    const children = this.children;
    if (children) {
      const currentIndex = this.detectCurrentIndex();
      let index = Math.max(0, Math.min(children.length - 1, currentIndex + (direction * (1 + (this.skip || 0)) )));

      this.beforeAnimate.emit({ currentIndex, targetIndex: index });
      const coords = await this.smooth.scrollToElement(children[index], this.options).toPromise();

      if (this.interrupted) {
        index = this.detectCurrentIndex();
        this.interrupted = false;
      }
      this.afterAnimate.emit({ prevIndex: currentIndex, currentIndex: index, scrollCoords: coords });

      this.animating = false;
    }
  }

  private get heading(): 'horizontal' | 'vertical' {
    return this.direction || 'vertical';
  }
  private detectCurrentIndex(): number {
    switch (this.heading) {
      case 'vertical':
        return this.indexDetector.detectY(this.children);
      case 'horizontal':
        return this.indexDetector.detectX(this.children);
    }
  }

}
