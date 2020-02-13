export interface NgxSmoothScrollOption {
    duration?: number;
    timingFunction?: string;
    alignX?: 'start' | 'center' | 'end';
    alignY?: 'start' | 'center' | 'end';
    stopOnArrival?: boolean;
}

export interface NgxSmoothScrollDirectiveOption extends NgxSmoothScrollOption {
    wheel?: NgxSmoothScrollOption;
    keydown?: NgxSmoothScrollOption;
    mouse?: NgxSmoothScrollOption;
    touch?: NgxSmoothScrollOption;
}

export interface Coords {
    x: number;
    y: number;
}

export type bezierArray = [number, number, number, number]

export interface NgxSmoothScrollKeyCode {
    'forward'?: Array<number>;
    'reverse'?: Array<number>;
}

export interface NgxSmoothScrollBeforeAnimateEvent {
    currentIndex: number;
    targetIndex: number;
}

export interface NgxSmoothScrollAfterAnimateEvent {
    prevIndex: number;
    currentIndex: number;
    scrollCoords: Coords;
}

export interface ListenerData {
    [key: string]: any;
    events: Array<() => void>;
}