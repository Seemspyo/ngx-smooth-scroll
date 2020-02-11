/** Native Modules */
import { BehaviorSubject, Observable } from 'rxjs';

/** Types */
import { bezierArray, NgxSmoothScrollOption, Coords } from '../@types';

/** Custom Modules */
import { Bezier } from './bezier.core';


export class NgxSmoothScroll {

    private readonly timingFunctionMap: Map<string, string> = new Map([
        [ 'ease', '.25,.1,.25,1' ],
        [ 'linear', '0,0,1,1' ],
        [ 'ease-in', '.42,0,1,1' ],
        [ 'ease-out', '0,0,.58,1' ],
        [ 'ease-in-out', '.42,0,.58,1' ]
    ]);
    private frameId: number;
    private subject: BehaviorSubject<Coords>;

    constructor(
        private containerEl: HTMLElement,
        public childSelector?: string
    ) {
        if (!this.isHTMLElement(containerEl)) throw new TypeError('container element must be an instance of HTMLElement');
    }

    public scrollTo(destination: Coords, options: NgxSmoothScrollOption = {}): Observable<Coords> {
        const
        duration = typeof options.duration === 'number' ? options.duration : 600,
        bezier = new Bezier(...this.parseTimingFunction(options.timingFunction || 'ease'));

        const initial = this.getScrollCoords();
        let startT: number;

        this.subject = new BehaviorSubject(initial);

        const frame = (timestamp: number) => {
            if (!startT) startT = timestamp;
            const
            progress = (timestamp - startT) / duration,
            t1 = bezier.solve(progress),
            s1 = 1.0 - t1;

            if (progress < 1) {
                this.scroll({ x: initial.x * s1 + destination.x * t1, y: initial.y * s1 + destination.y * t1 });
                this.frameId = window.requestAnimationFrame(frame);
            } else {
                this.scroll(destination);
                this.finishAnimate(destination);
            }
        }

        this.frameId = window.requestAnimationFrame(frame);

        return this.subject;
    }

    public scrollToElement(el: HTMLElement, options?: NgxSmoothScrollOption): Observable<Coords> {
        if (!this.isHTMLElement(el)) throw new TypeError('first paramter must be an instance of HTMLElement');

        const destination = this.getDestinationCoords(el, options);

        return this.scrollTo(destination, options);
    }

    public scrollToIndex(index: number, options?: NgxSmoothScrollOption): Observable<Coords> {
        const child = (this.containerEl.querySelectorAll(this.childSelector)[index] || document.querySelectorAll(this.childSelector)[index]) as HTMLElement;
        if (!this.isHTMLElement(child)) throw new TypeError('child must be an instance of HTMLElement');

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
        this.subject.next(coords);
        this.subject.complete();

        this.frameId = null;
        this.subject = null;
    }

    private isHTMLElement(el: any): boolean {
        return el instanceof HTMLElement;
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

    private getDestinationCoords(el: HTMLElement, options: NgxSmoothScrollOption = {}): Coords {
        const
        alignX = options.alignX || 'start',
        alignY = options.alignY || 'start';

        const isContainerStatic = window.getComputedStyle(this.containerEl).getPropertyValue('position') === 'static';
        let { offsetTop, offsetLeft, clientWidth, clientHeight } = this.containerEl;

        if (!isContainerStatic) offsetTop = offsetLeft = 0;

        let
        x: number,
        y: number;

        switch (alignX) {
            case 'start':
                x = el.offsetLeft - offsetLeft;
                break;
            case 'center':
                x = el.offsetLeft - offsetLeft + (el.offsetWidth - clientWidth) / 2;
                break;
            case 'end':
                x = el.offsetLeft - offsetLeft + el.offsetWidth - clientWidth;
        }

        switch (alignY) {
            case 'start':
                y = el.offsetTop - offsetTop;
                break;
            case 'center':
                y = el.offsetTop - offsetTop + (el.offsetHeight - clientHeight) / 2;
                break;
            case 'end':
                y = el.offsetTop - offsetTop + el.offsetHeight - clientHeight;
                break;
        }

        return { x, y }
    }

}