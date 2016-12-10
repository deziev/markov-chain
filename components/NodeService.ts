import { Point } from './ElementService';

interface RelatedNodes {
    northNode: Array<number>;
    southNode: Array<number>;
    westNode: Array<number>;
    eastNode: Array<number>;
}

interface ChainSize {
    rows: number;
    cols: number;
}


export class ChainNode {
    _index: Point = {
        x: -1,
        y: -1
    };
    _relatedNodes: RelatedNodes = {
        northNode: [],
        southNode: [],
        westNode: [],
        eastNode: []
    }
    _isFilled: boolean = false;
    _filledWith: number = NaN;

    constructor(index: Point, chainSize: ChainSize) {
        this._index = index;
        // TODO: fix govnocod 
        if(index.x == 0) {
            this._relatedNodes.eastNode[1] = index.x + 1; 
            this._relatedNodes.eastNode[0] = index.y; 
        }
        if(index.x > 0 && index.x < chainSize.cols - 1) {
            this._relatedNodes.westNode[1] = index.x - 1;
            this._relatedNodes.westNode[0] = index.y;
            this._relatedNodes.eastNode[1] = index.x + 1;
            this._relatedNodes.eastNode[0] = index.y;
        }
        if(index.x == chainSize.cols - 1) {
            this._relatedNodes.westNode[1] = index.x - 1;
            this._relatedNodes.westNode[0] = index.y;
        }

        if(chainSize.rows > 1) {
            if(index.y == 0) {
                this._relatedNodes.southNode[0] = index.y + 1;
                this._relatedNodes.southNode[1] = index.x;
            }
            if(index.y > 0 && index.y < chainSize.rows - 1) {
                this._relatedNodes.northNode[0] = index.y - 1;
                this._relatedNodes.northNode[1] = index.x;
                this._relatedNodes.southNode[0] = index.y + 1;
                this._relatedNodes.southNode[1] = index.x;
            }
            if(index.y == chainSize.rows - 1) {
                this._relatedNodes.northNode[0] = index.y - 1;
                this._relatedNodes.northNode[1] = index.x;
            }
        }

    }

    get relations() : RelatedNodes {
        return this._relatedNodes;
    }

    get index() : Point {
        return this._index;
    }

    get isFilled() : Boolean {
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

