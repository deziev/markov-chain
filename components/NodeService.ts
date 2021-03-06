import { Point } from './primitives/Point';
import { IPoint } from './primitives/IPoint';

import appconfig from '../config/appconfig';

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
            if(appconfig.horizontalLoop) {
                this._relatedNodes.westNode = new Point(chainSize.cols - 1, index.y);
            }
        }
        if(index.x > 0 && index.x < chainSize.cols - 1) {
            this._relatedNodes.westNode = new Point(index.x - 1, index.y);
            this._relatedNodes.eastNode = new Point(index.x + 1, index.y);
        }
        if(index.x == chainSize.cols - 1) {
            this._relatedNodes.westNode = new Point(index.x - 1, index.y);
            if(appconfig.horizontalLoop) {
                this._relatedNodes.eastNode = new Point(0, index.y);
            }
        }

        if(chainSize.rows > 1) {
            if(index.y == 0) {
                this._relatedNodes.southNode = new Point(index.x, index.y + 1);
                if (appconfig.verticalLoop) {
                    this._relatedNodes.northNode = new Point(index.x, chainSize.rows - 1);
                }
            }
            if(index.y > 0 && index.y < chainSize.rows - 1) {
                this._relatedNodes.northNode = new Point(index.x, index.y - 1);
                this._relatedNodes.southNode = new Point(index.x, index.y + 1);
            }
            if(index.y == chainSize.rows - 1) {
                this._relatedNodes.northNode = new Point(index.x, index.y - 1);
                if (appconfig.verticalLoop) {
                    this._relatedNodes.southNode = new Point(index.x, 0);
                }
            }
        }

        //console.log('RELS: ' + JSON.stringify(this.relations));
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

    get filledWith() : number {
        return this._filledWith;
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

