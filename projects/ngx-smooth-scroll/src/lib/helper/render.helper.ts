import { Renderer2 } from '@angular/core';


export class RenderHelper {

    constructor(
        private renderer: Renderer2
    ) {}

    public listen(target: any, type: string, handler: (e: Event) => boolean | void, options?: boolean | AddEventListenerOptions): () => void {
        if (options !== void(0)) return this.renderer.listen(target, type, handler);
        else {
            target.addEventListener(type, handler, options);

            return () => target.removeEventListener(type, handler, options);
        }
    }

}