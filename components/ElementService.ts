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

    constructor(id: number, destination: Point, currentPosition: Point) {
        this._id = id; 
        this._destination = destination;
        this._currentPosition = currentPosition;
        if (currentPosition == destination) {
            this.isReached_ = true;
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


    checkItemIsReached() : Boolean {
        //console.log('Pos: ' + JSON.stringify(this._currentPosition) + '\n' +
           //         'Dest: ' + JSON.stringify(this._destination));
        return this._currentPosition.x == this._destination.x &&
               this._currentPosition.y == this._destination.y; 
    }

}