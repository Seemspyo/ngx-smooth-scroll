/** Native Modules */
import { ElementRef } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

/** Types */
import { bezierArray, NgxSmoothScrollOption, Coords } from '../@types';

/** Custom Modules */
import { Bezier } from './bezier.core';
import { CoordsDetector } from './coords-detector.core';


export class NgxSmoothScroll {

    private readonly timingFunctionMap: Map<string, string> = new Map([
        [ 'ease', '.25,.1,.25,1' ],
        [ 'linear', '0,0,1,1' ],
        [ 'ease-in', '.42,0,1,1' ],
        [ 'ease-out', '0,0,.58,1' ],
        [ 'ease-in-out', '.42,0,.58,1' ]
    ]);

    private coordsDetector: CoordsDetector;

    private frameId: number;
    private subject: BehaviorSubject<Coords>;

    public get defaultOption(): NgxSmoothScrollOption {
      return {
        duration: 600,
        timingFunction: 'ease',
        alignX: 'start',
        alignY: 'start',
        stopOnArrival: false
      }
    }

    constructor(
        private _containerEl: HTMLElement | ElementRef,
        public childSelector?: string
    ) {
        try {
            this.coordsDetector = new CoordsDetector(this.getNativeElement(_containerEl));
        } catch (error) {
            throw new TypeError('container element must be an instance of HTMLElement or ElementRef');
        }
    }

    public get containerEl(): HTMLElement {
        return this.getNativeElement(this._containerEl);
    }

    public scrollTo(destination: Coords, options: NgxSmoothScrollOption = {}): Observable<Coords> {
        const
        defaultOption = this.defaultOption,
        duration = typeof options.duration === 'number' ? options.duration : defaultOption.duration,
        bezier = new Bezier(...this.parseTimingFunction(options.timingFunction || defaultOption.timingFunction)),
        stopOnArrival = typeof options.stopOnArrival === 'boolean' ? options.stopOnArrival : defaultOption.stopOnArrival;

        const initial = this.getScrollCoords();
        destination = Object.assign({ x: 0, y: 0 }, destination);

        let startT: number;

        this.subject = new BehaviorSubject(initial);

        const frame = (timestamp: number) => {
            if (!startT) startT = timestamp;
            const
            progress = (timestamp - startT) / duration,
            t1 = bezier.solve(progress),
            s1 = 1.0 - t1;

            const direction: Coords = {
                x: Math.sign(destination.x - initial.x),
                y: Math.sign(destination.y - initial.y)
            }

            if (progress < 1) {
                const
                x = initial.x * s1 + destination.x * t1,
                y = initial.y * s1 + destination.y * t1;

                if (stopOnArrival && this.isOverstepped({ x, y }, destination, direction)) {
                    this.scroll(destination);
                    this.finishAnimate(destination);
                } else {
                    this.scroll({ x, y });
                    this.frameId = window.requestAnimationFrame(frame);
                }
            } else {
                this.scroll(destination);
                this.finishAnimate(destination);
            }
        }

        this.frameId = window.requestAnimationFrame(frame);

        return this.subject;
    }

    public scrollToElement(el: HTMLElement | ElementRef, options?: NgxSmoothScrollOption): Observable<Coords> {
        const destination = this.getDestinationCoords(this.getNativeElement(el), options);

        return this.scrollTo(destination, options);
    }

    public scrollToIndex(index: number, options?: NgxSmoothScrollOption, doc?: Document): Observable<Coords> {
        const child = (this.containerEl.querySelectorAll(this.childSelector)[index] || (doc || document).querySelectorAll(this.childSelector)[index]) as HTMLElement;

        return this.scrollToElement(child, options);
    }

    public interrupt(): boolean {
        if (this.frameId) {
            window.cancelAnimationFrame(this.frameId);
            this.finishAnimate(this.getScrollCoords());

            return true;
        }

        return false;
    }

    private finishAnimate(coords: Coords): void {
        if (this.subject) {
            this.subject.next(coords);
            this.subject.complete();
        }

        this.frameId = null;
        this.subject = null;
    }

    private parseTimingFunction(timingFunction: string): bezierArray {
        const bezierString: string = this.timingFunctionMap.has(timingFunction) ? this.timingFunctionMap.get(timingFunction) : timingFunction;

        let bezierArray = bezierString.split(',');
        if (bezierArray.length !== 4) {
            console.error(new TypeError(`${ timingFunction } is not a valid timing function`));
            bezierArray = this.timingFunctionMap.get('ease').split(',');
        }

        return bezierArray.map(float => {
            float = float.trim();
            if (float.charAt(0) === '.') float = `0${ float }`;

            return Number.parseFloat(float);
        }) as bezierArray;
    }

    private scroll(coords: Coords): void {
        this.containerEl.scrollLeft = coords.x;
        this.containerEl.scrollTop = coords.y;
    }

    private getScrollCoords(): Coords {
        return { x: this.containerEl.scrollLeft, y: this.containerEl.scrollTop }
    }

    private getDestinationCoords(childEl: HTMLElement, options: NgxSmoothScrollOption = {}): Coords {
        const
        defaultOption = this.defaultOption,
        alignX = options.alignX || defaultOption.alignX,
        alignY = options.alignY || defaultOption.alignY;

        const
        position = this.coordsDetector.getAbsoluteCoords(this.containerEl, childEl),
        { clientWidth, clientHeight } = this.containerEl;

        let
        x: number,
        y: number;

        switch (alignX) {
            case 'start':
                x = position.x;
                break;
            case 'center':
                x = position.x + (childEl.offsetWidth - clientWidth) / 2;
                break;
            case 'end':
                x = position.x + childEl.offsetWidth - clientWidth;
        }

        switch (alignY) {
            case 'start':
                y = position.y;
                break;
            case 'center':
                y = position.y + (childEl.offsetHeight - clientHeight) / 2;
                break;
            case 'end':
                y = position.y + childEl.offsetHeight - clientHeight;
                break;
        }

        return { x, y }
    }

    private getNativeElement(el: any): HTMLElement {
        if (el instanceof ElementRef) return el.nativeElement;
        if (el instanceof HTMLElement) return el;

        throw new TypeError(`received paramter ${ el } is not an instance of HTMLElement nor ElementRef`);
    }

    private isOverstepped(progress: Coords, destination: Coords, direction: Coords): boolean {
        return ['x', 'y'].every(key => progress[key] * direction[key] >= destination[key] * direction[key]);
    }

}