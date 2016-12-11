import { Point } from './primitives/Point';
import { IPoint } from './primitives/IPoint';

export class Item {
    _id: number;
    _destination: Point;
    _currentPosition: Point;
    _isReached: boolean = false;
    _stepCounter: number = 0;

    constructor(id: number, destination: IPoint, currentPosition: IPoint) {
        this._id = id; 
        this._destination = new Point(destination.x, destination.y);
        this._currentPosition = new Point(currentPosition.x, currentPosition.y);
        if (this._currentPosition.equalTo(this._destination)) {
            this._isReached = true;
        }
    }

    changePosition(point: IPoint) : void {
        this.makeStepAxisX(point.x);
        this.makeStepAxisY(point.y);
        if(point.x > 0 || point.y > 0) {
            this._stepCounter++;
        }
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

    get stepCount() : number {
        return this._stepCounter;
    }
}