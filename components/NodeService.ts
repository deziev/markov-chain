import { Point } from './ElementService';

interface RelatedNodes {
    northNode: number;
    southNode: number;
    westNode: number;
    eastNode: number;
}


export class ChainNode {
    _index: Point = {
        x: -1,
        y: -1
    };
    _relatedNodes: RelatedNodes = {
        northNode: null,
        southNode: null,
        westNode: null,
        eastNode: null
    }
    _isFilled: boolean = false;
    _filledWith: number = NaN;

    constructor(index: Point, chainSize: Object ) {
        this._index = index;
        if(index.x == 0) {
            this._relatedNodes.eastNode = index.x + 1; 
        }
        if(index.x > 0 && index.x < chainSize.d2 - 1) {
            this._relatedNodes.westNode = index.x - 1;
            this._relatedNodes.eastNode = index.x + 1;
        }
        if(index.x == nodeArray.length - 1) {
            this._relatedNodes.westNode = index.x - 1;
        }

        if(index.y == 0) {
            this._relatedNodes.southNode = index.y + 1;
        }
        if(index.y > 0 && index.y < nodeArray.length - 1) {
            this._relatedNodes.northNode = index.y - 1;
            this._relatedNodes.southNode = index.y + 1;
        }
        if(index.y == nodeArray.length - 1) {
            this._relatedNodes.northNode = index.y - 1;
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

