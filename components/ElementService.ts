export interface Point {
    x: number;
    y?: number;
}

export class Item {
    _id: number;
    _destination: Point = {
        x: -1,
        y: -1
    };
    _currentPosition: Point = {
        x: -1,
        y: -1
    }
    isReached_: boolean = false;
    constructor(destination: Point, currentPosition: Point) {
        this._destination = destination;
        this._currentPosition = currentPosition;
        if (currentPosition == destination) {
            this.isReached_ = true;
        }
    }

    get currentPosition() : Point {
        return this._currentPosition;
    }

    set currentPosition(position: Point) {
        this._currentPosition = position;
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

}