/**
 * Credit: https://stackoverflow.com/questions/11696736/recreating-css3-transitions-cubic-bezier-curve
 */

export class Bezier {

    private cx: number;
    private bx: number;
    private ax: number;

    private cy: number;
    private by: number;
    private ay: number;

    private readonly EPSILON = 1e-6;

    constructor(Bx: number, By: number, Cx: number, Cy: number) {
        this.cx = 3.0 * Bx;
        this.bx = 3.0 * (Cx - Bx) - this.cx;
        this.ax = 1.0 - this.cx - this.bx;
    
        this.cy = 3.0 * By;
        this.by = 3.0 * (Cy - By) - this.cy;
        this.ay = 1.0 - this.cy - this.by;
    }

    public solve(x: number): number {
        return this.sampleCurveY(this.solveCurveX(x));
    }

    private sampleCurveX(t: number): number {
        return ((this.ax * t + this.bx) * t + this.cx) * t;
    }

    private sampleCurveY(t: number): number {
        return ((this.ay * t + this.by) * t + this.cy) * t;
    }

    private sampleCurveDerivativeX(t: number): number {
        return (3.0 * this.ax * t + 2.0 * this.bx) * t + this.cx;
    }

    private solveCurveX(x: number): number {
        let
        t0: number,
        t1: number,
        t2: number,
        x2: number,
        d2: number,
        i: number
    
        for (t2 = x, i = 0; i < 8; i++) {
            x2 = this.sampleCurveX(t2) - x;
            if (Math.abs (x2) < this.EPSILON)
                return t2;
            d2 = this.sampleCurveDerivativeX(t2);
            if (Math.abs(d2) < this.EPSILON)
                break;
            t2 = t2 - x2 / d2;
        }

        t0 = 0.0;
        t1 = 1.0;
        t2 = x;
    
        if (t2 < t0) return t0;
        if (t2 > t1) return t1;
    
        while (t0 < t1) {
            x2 = this.sampleCurveX(t2);
            if (Math.abs(x2 - x) < this.EPSILON)
                return t2;
            if (x > x2) t0 = t2;
            else t1 = t2;
    
            t2 = (t1 - t0) * .5 + t0;
        }

        return t2;
    }

}