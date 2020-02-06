export interface NgxSmoothScrollOption {
    duration?: number;
    timingFunction?: string;
    alignX?: 'start' | 'center' | 'end';
    alignY?: 'start' | 'center' | 'end';
}

export interface Coords {
    x: number;
    y: number;
}

export type bezierArray = [number, number, number, number]

export type NgxSmoothScrollKeyCodeMap = Map<'normal' | 'reverse', number[]>;

export interface NgxSmoothScrollBeforeAnimateEvent {
    currentIndex: number;
    targetIndex: number;
}

export interface NgxSmoothScrollAfterAnimateEvent {
    prevIndex: number;
    currentIndex: number;
    scrollCoords: Coords;
}