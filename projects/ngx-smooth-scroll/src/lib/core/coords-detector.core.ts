import { Coords } from '../@types';

export class CoordsDetector {

    constructor(
        private containerEl: HTMLElement
    ) {}

    public detect(children: Array<HTMLElement>, offsetX: number, offsetY: number): number {
        const
        barometer: Coords = {
            x: this.containerEl.scrollLeft + this.containerEl.offsetWidth * offsetX,
            y: this.containerEl.scrollTop + this.containerEl.offsetHeight * offsetY
        }

        for (const [ index, child ] of children.entries()) {
            const { x, y } = this.getAbsoluteCoords(this.containerEl, child);

            if (
                x <= barometer.x
                && barometer.x < x + child.offsetWidth
                && y <= barometer.y
                && barometer.y < y + child.offsetHeight
            ) return index;
        }

        return 0;
    }

    public detectX(children: Array<HTMLElement>, offsetX: number): number {
        const barometer = this.containerEl.scrollLeft + this.containerEl.offsetWidth * offsetX;

        for (const [ index, child ] of children.entries()) {
            const { x } = this.getAbsoluteCoords(this.containerEl, child);

            if (x <= barometer && barometer < x + child.offsetWidth) return index;
        }

        return 0;
    }

    public detectY(children: Array<HTMLElement>, offsetY: number): number {
        const barometer = this.containerEl.scrollTop + this.containerEl.offsetHeight * offsetY;
    
        for (const [ index, child ] of children.entries()) {
          const { y } = this.getAbsoluteCoords(this.containerEl, child);
    
          if (y <= barometer && barometer < y + child.offsetHeight) return index;
        }

        return 0;
    }

    public getAbsoluteCoords(parentEl: HTMLElement, childEl: HTMLElement): Coords {
        let
        currentEl = childEl,
        x: number = 0,
        y: number = 0;

        for (const el of this.getRelativeParentTree(parentEl, childEl)) {
            x += currentEl.offsetLeft;
            y += currentEl.offsetTop;

            currentEl = el;
        }

        if (currentEl !== parentEl) {
            x += currentEl.offsetLeft - parentEl.offsetLeft;
            y += currentEl.offsetTop - parentEl.offsetTop;
        }

        return { x, y }
    }

    private getRelativeParentTree(parentEl: HTMLElement, childEl: HTMLElement): Array<HTMLElement> {
        const tree: Array<HTMLElement> = new Array();
        let currentParentEl: HTMLElement = childEl.parentElement;

        while (currentParentEl !== parentEl) {
            if (!this.isStatic(currentParentEl)) tree.push(currentParentEl);
            currentParentEl = currentParentEl.parentElement;
        }

        if (!this.isStatic(parentEl)) tree.push(parentEl);

        return tree;
    }

    private isStatic(el: HTMLElement): boolean {
        return window.getComputedStyle(el).getPropertyValue('position') === 'static';
    }

}