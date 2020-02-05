export class IndexDetector {

    constructor(
        private containerEl: HTMLElement
    ) {}

    public detectX(children: Array<HTMLElement>): number {
        const
        containerLeft = this.containerEl.offsetLeft,
        horizontalMiddle = this.containerEl.scrollLeft + this.containerEl.offsetWidth / 2;

        for (const [ index, child ] of children.entries()) {
            const childLeft = child.offsetLeft - containerLeft;

            if (childLeft < horizontalMiddle && horizontalMiddle < childLeft + child.offsetWidth) return index;
        }

        return 0;
    }

    public detectY(children: Array<HTMLElement>): number {
        const
        containerTop = this.containerEl.offsetTop,
        verticalMiddle = this.containerEl.scrollTop + this.containerEl.offsetHeight / 2;
    
        for (const [ index, child ] of children.entries()) {
          const childTop = child.offsetTop - containerTop;
    
          if (childTop < verticalMiddle && verticalMiddle < childTop + child.offsetHeight) return index;
        }

        return 0;
    }

}