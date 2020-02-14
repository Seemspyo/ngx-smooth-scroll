/** Native Modules */
import { Directive, AfterViewInit, OnChanges, OnDestroy, Renderer2, ElementRef, Input, SimpleChanges, Output, EventEmitter, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Observable } from 'rxjs';

/** Types */
import { NgxSmoothScrollKeyCode, NgxSmoothScrollDirectiveOption, NgxSmoothScrollOption, NgxSmoothScrollBeforeAnimateEvent, NgxSmoothScrollAfterAnimateEvent, Coords, ListenerData } from './@types';

/** Custom Modules */
import { NgxSmoothScroll } from './core/smooth-scroll.core';
import { CoordsDetector } from './core/coords-detector.core';
import { RenderHelper } from './helper/render.helper';


/** @dynamic */
@Directive({
  selector: '[ngxSmoothScroll]',
  exportAs: 'ngxSmoothScroll'
})
export class NgxSmoothScrollDirective implements AfterViewInit, OnChanges, OnDestroy {

  @Input() childSelector: string = '.ngx-smooth-scroll-content';
  @Input() keyCode: NgxSmoothScrollKeyCode = {
    forward: [ 39, 40, 68, 83 ],
    reverse: [ 37, 38, 65, 87 ]
  }
  @Input() skip: number = 0;
  @Input('ngxSmoothScroll') options: NgxSmoothScrollDirectiveOption;

  @Input() autoInterruption: boolean = false;
  @Input() autoDetect: boolean = true;
  @Input() autoDetectDirection: 'mixed' | 'vertical' | 'horizontal' = 'mixed';
  @Input() detectOffsetX: number = 0.5;
  @Input() detectOffsetY: number = 0.5;

  @Input() actionDirection: 'mixed' | 'vertical' | 'horizontal' = 'mixed';
  @Input() actionMinDistance: number = 30;

  @Input('smooth-wheel') wheel: boolean | any = false;
  @Input('smooth-keydown') keydown: boolean | any = false;
  @Input('smooth-mouse') mouse: boolean | any = false;
  @Input('smooth-touch') touch: boolean | any = false;

  @Output() beforeAnimate: EventEmitter<NgxSmoothScrollBeforeAnimateEvent> = new EventEmitter();
  @Output() afterAnimate: EventEmitter<NgxSmoothScrollAfterAnimateEvent> = new EventEmitter();

  private smooth: NgxSmoothScroll;
  private coordsDetector: CoordsDetector;
  private renderHelper: RenderHelper;

  private eventMap: Map<string, ListenerData> = new Map();
  private animating: boolean;
  private interrupted: boolean;
  private _currentIndex: number = 0;

  private changeActions: { [key: string]: (value: any) => void } = {
    childSelector: value => this.smooth.childSelector = value,
    wheel: value => this.bind('wheel', value),
    keydown: value => this.bind('keydown', value),
    mouse: value => this.bind('mouse', value),
    touch: value => this.bind('touch', value),
    autoDetect: value => {
      if (!this.isTruthy(value)) this._currentIndex = this.detectCurrentIndex();
    }
  }

  private startCoords: Coords;

  constructor(
    private containerElRef: ElementRef,
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document
  ) {}

  ngAfterViewInit() {
    this.smooth = new NgxSmoothScroll(this.containerEl, this.childSelector);
    this.coordsDetector = new CoordsDetector(this.containerEl);
    this.renderHelper = new RenderHelper(this.renderer);

    for (const key of ['wheel', 'keydown', 'mouse', 'touch']) {
      if (this.isTruthy(this[key])) this.changeActions[key](this[key]);
    }

    if (!this.autoDetect) this._currentIndex = this.detectCurrentIndex();
  }

  ngOnChanges(changes: SimpleChanges) {
    for (const key in this.changeActions) {
      const change = changes[key];

      if (change && !change.firstChange && change.previousValue !== change.currentValue) this.changeActions[key](change.currentValue);
    }
  }

  ngOnDestroy() {
    for (const [key, data] of this.eventMap) {
      for (const remove of data.events) remove();
    }
  }

  public get containerEl(): HTMLElement {
    return this.containerElRef.nativeElement;
  }

  public get children(): Array<HTMLElement> {
    if (!this.childSelector) return []

    let children = this.containerEl.querySelectorAll(this.childSelector);
    if (!children.length) children =  this.document.querySelectorAll(this.childSelector);

    return Array.from(children as NodeListOf<HTMLElement>);
  }

  public get currentIndex(): number {
    return this._currentIndex;
  }

  public scrollTo(destination: Coords, options?: NgxSmoothScrollOption): Observable<Coords> {
    return this.smooth.scrollTo(destination, options);
  }

  public scrollToElement(el: HTMLElement | ElementRef, options?: NgxSmoothScrollOption): Observable<Coords> {
    return this.smooth.scrollToElement(el, options);
  }

  public scrollToIndex(index: number, options?: NgxSmoothScrollOption): Observable<Coords> {
    return this.smooth.scrollToIndex(index, options, this.document);
  }

  public interrupt(): boolean {
    if (this.interrupted) return false;

    this.interrupted = true;

    return this.smooth.interrupt();
  }

  private bind(name: string, value: boolean | any): void {
    switch (this.isTruthy(value)) {
      case true:
        if (this.eventMap.has(name)) this.destroy(name);

        this.init(name, value);
        break;
      case false:
        this.destroy(name);
        break;
    }
  }

  private init(name: string, value: any): void {
    let targets = [ this.containerEl ]

    const valueType = typeof value;
    if (valueType !== 'string' && valueType !== 'boolean') {
      if (!Array.isArray(value)) targets = [ value ]
      else targets = value;
    }

    let handler: (e: Event) => void;
    const
    active = { passive: false },
    data: ListenerData = { events: new Array() }

    switch (name) {
      case 'wheel':
        handler = (e: WheelEvent) => this.onWheel(e);

        for (const target of targets) data.events.push( this.renderHelper.listen(target, 'wheel', handler, active) );
        break;
      case 'keydown':
        handler = (e: KeyboardEvent) => this.onKeydown(e);
        data.tabindexAssign = new Array();

        for (const target of targets) {
          if (!target.hasAttribute('tabindex')) {
            this.renderer.setAttribute(target, 'tabindex', '0');
            data.tabindexAssign.push(target);
          }

          data.events.push( this.renderHelper.listen(target, 'keydown', handler, active) );
        }
        break;
      case 'mouse':
        handler = (e: MouseEvent) => this.onMouse(e);

        for (const target of targets) data.events.push(
          this.renderHelper.listen(target, 'mousedown', handler),
          this.renderHelper.listen(target, 'mouseup', handler)
        );
        break;
      case 'touch':
        handler = (e: TouchEvent) => this.onTouch(e);

        for (const target of targets) data.events.push(
          this.renderHelper.listen(target, 'touchstart', handler),
          this.renderHelper.listen(target, 'touchmove', handler, active),
          this.renderHelper.listen(target, 'touchend', handler)
        );
        break;
    }

    this.eventMap.set(name, data);
  }

  private destroy(name: string): void {
    const data = this.eventMap.get(name);
    if (!data) return;

    switch (name) {
      case 'keydown':
        for (const target of data.tabindexAssign) this.renderer.removeAttribute(target, 'tabindex');
        break;
      case 'wheel':
      case 'mouse':
      case 'touch':
        break;
      default:
        return;
    }

    for (const remove of data.events) remove();

    this.eventMap.delete(name);
  }

  private onWheel(event: WheelEvent): void {
    event.preventDefault();

    this.animate(Math.sign(event.deltaY), 'wheel');
  }

  private onKeydown(event: KeyboardEvent): void {
    let direction: number;

    const { forward, reverse } = this.keyCode;

    switch (true) {
      case forward.includes(event.keyCode):
        direction = +1;
        break;
      case reverse.includes(event.keyCode):
        direction = -1;
        break;
      default:
        return;
    }

    event.preventDefault();

    this.animate(direction, 'keydown');
  }

  private onMouse(event: MouseEvent): void {
    switch (event.type) {
      case 'mousedown':
        const { clientX, clientY } = event;

        this.startCoords = { x: clientX, y: clientY }
        break;
      case 'mouseup':
        let distance: number;

        switch (this.actionDirection) {
          case 'mixed':
            const
            distanceX = this.startCoords.x - event.clientX,
            distanceY = this.startCoords.y - event.clientY;

            distance = Math.abs(distanceX) > Math.abs(distanceY) ? distanceX : distanceY;
            break;
          case 'horizontal':
            distance = this.startCoords.x - event.clientX;
            break;
          case 'vertical':
            distance = this.startCoords.y - event.clientY;
            break;
        }

        if (Math.abs(distance) > this.actionMinDistance) this.animate(Math.sign(distance), 'mouse');
        break;
    }
  }

  private onTouch(event: TouchEvent): void {
    switch (event.type) {
      case 'touchstart':
        const { clientX, clientY } = event.touches[0];

        this.startCoords = { x: clientX, y: clientY }
        break;
      case 'touchmove':
        event.preventDefault();
        break;
      case 'touchend':
        const changedTouch = event.changedTouches[0];

        let distance: number;

        switch (this.actionDirection) {
          case 'mixed':
            const
            distanceX = this.startCoords.x - changedTouch.clientX,
            distanceY = this.startCoords.y - changedTouch.clientY;

            distance = Math.abs(distanceX) > Math.abs(distanceY) ? distanceX : distanceY;
            break;
          case 'horizontal':
            distance = this.startCoords.x - changedTouch.clientX;
            break;
          case 'vertical':
            distance = this.startCoords.y - changedTouch.clientY;
            break;
        }

        if (Math.abs(distance) > this.actionMinDistance) this.animate(Math.sign(distance), 'touch');
        break;
    }
  }

  private async animate(direction: number, name: string): Promise<void> {
    if (this.animating) {
      if (this.autoInterruption) this.smooth.interrupt();
      else return;
    }

    this.animating = true;

    const children = this.children;

    if (children) {
      const currentIndex = this.autoDetect ? this.detectCurrentIndex() : this._currentIndex;
      let index = Math.max(0, Math.min(children.length - 1, currentIndex + (direction * (1 + this.skip)) ));

      this.beforeAnimate.emit({ currentIndex, targetIndex: index });
      const coords = await this.smooth.scrollToIndex(index, this.getOptions(name)).toPromise();

      if (this.interrupted) {
        index = this.autoDetect ? this.detectCurrentIndex() : currentIndex;
        this.interrupted = false;
      }

      this.afterAnimate.emit({ prevIndex: currentIndex, currentIndex: index, scrollCoords: coords });

      this._currentIndex = index;
      this.animating = false;
    }
  }

  private detectCurrentIndex(): number {
    const detector = this.coordsDetector;

    switch (this.autoDetectDirection) {
      case 'mixed':
        return detector.detect(this.children, this.detectOffsetX, this.detectOffsetY);
      case 'horizontal':
        return detector.detectX(this.children, this.detectOffsetX);
      case 'vertical':
        return detector.detectY(this.children, this.detectOffsetY);
    }
  }

  private getOptions(name: string): NgxSmoothScrollOption {
    const
    globalOption = { ...this.options },
    uniqueOption = globalOption[name];

    return Object.assign(globalOption, uniqueOption);
  }

  private isTruthy(value: any): boolean {
    if (value || typeof value === 'string' || typeof value === 'number') return true;
    return false;
  }

}
