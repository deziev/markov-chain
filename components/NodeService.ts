import { IPoint } from './ElementService';
import { Point } from './ElementService';

interface RelatedNodes {
    northNode: IPoint;
    southNode: IPoint;
    westNode: IPoint;
    eastNode: IPoint;
}

interface ChainSize {
    rows: number;
    cols: number;
}


export class ChainNode {
    _index: Point;
    _relatedNodes: RelatedNodes = {
        northNode: null,
        southNode: null,
        westNode: null,
        eastNode: null
    }
    _isFilled: boolean = false;
    _filledWith: number = NaN;

    constructor(index: IPoint, chainSize: ChainSize) {
        this._index = new Point(index.x, index.y);
        // TODO: fix govnocod 
        if(index.x == 0) {
            this._relatedNodes.eastNode = new Point(index.x + 1, index.y);
        }
        if(index.x > 0 && index.x < chainSize.cols - 1) {
            this._relatedNodes.westNode = new Point(index.x - 1, index.y);
            this._relatedNodes.eastNode = new Point(index.x + 1, index.y);
        }
        if(index.x == chainSize.cols - 1) {
            this._relatedNodes.westNode = new Point(index.x - 1, index.y);
        }

        if(chainSize.rows > 1) {
            if(index.y == 0) {
                this._relatedNodes.southNode = new Point(index.x, index.y + 1);
            }
            if(index.y > 0 && index.y < chainSize.rows - 1) {
                this._relatedNodes.northNode = new Point(index.x, index.y - 1);
                this._relatedNodes.southNode = new Point(index.x, index.y + 1);
            }
            if(index.y == chainSize.rows - 1) {
                this._relatedNodes.northNode = new Point(index.x, index.y - 1);
            }
        }

    }

    get relations() : RelatedNodes {
        return this._relatedNodes;
    }

    get index() : Point {
        return this._index;
    }

    get isFilled() : boolean {
        return this._isFilled;
    }

    release() : void {
        this._isFilled = false;
        this._filledWith = NaN;
    }


    fillWith(itemId: number) : void {
            this._isFilled = true;
            this._filledWith = itemId;
        }
}

