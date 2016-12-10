export interface IPoint {
    x: number;
    y?: number;
    //equalTo(b: IPoint) : boolean;
}


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


export class Item {
    _id: number;
    _destination: Point;
    _currentPosition: Point;
    _isReached: boolean = false;

    constructor(id: number, destination: IPoint, currentPosition: IPoint) {
        this._id = id; 
        this._destination = new Point(destination.x, destination.y);
        this._currentPosition = new Point(currentPosition.x, currentPosition.y);
        if (this._currentPosition.equalTo(this._destination)) {
            this._isReached = true;
        }
    }

    get currentPosition() : Point {
        return this._currentPosition;
    }

    get destination() : Point {
        return this._destination;
    }

    set currentPosition(position: Point) {
        this._currentPosition = position;
    }

    get id() : number {
        return this._id;
    }

    set isReached(state: boolean) {
        this._isReached = state;
    }

    get isReached() : boolean {
        return this._isReached;
    }

    makeStepAxisX(step: number) {
        let newPosition = this.currentPosition;
        newPosition.x = newPosition.x + step;
        this.currentPosition = newPosition;
    }

    makeStepAxisY(step: number) {
        let newPosition = this.currentPosition;
        newPosition.y = newPosition.y + step;
        this.currentPosition = newPosition;
    }


    checkItemIsReached() : boolean {
        return this._currentPosition.equalTo(this._destination); 
    }

}