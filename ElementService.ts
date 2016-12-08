export interface Point {
    x: number;
    y?: number;
}

export class Item {
    destination_: Point = {
        x: -1,
        y: -1
    };
    currentPosition_: Point = {
        x: -1,
        y: -1
    }
    isReached_: boolean = false;

    constructor(destination: Point, currentPosition: Point) {
        this.destination_ = destination;
        this.currentPosition_ = currentPosition;
        if (currentPosition == destination) {
            this.isReached_ = true;
        }
    }

    get currentPosition() : Point {
        return this.currentPosition_;
    }

    set currentPosition(position: Point) {
        this.currentPosition_ = position;
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