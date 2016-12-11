import { IPoint } from './IPoint';

export class Point  implements IPoint{
    x: number;
    y: number;

    constructor(x_: number, y_: number) {
        this.x = x_;
        this.y = y_;
    }

    equalTo(b: IPoint) : boolean {
        return this.x == b.x && this.y == b.y;
    }
}