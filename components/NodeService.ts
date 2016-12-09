import { Point } from './ElementService';
import { Item } from './ElementService';

interface RelatedNodes {
    northNode: number;
    southNode: number;
    westNode: number;
    eastNode: number;
}


class ChainNode {
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
    _filledWith: number;

    constructor(index: Point, nodeArray: Array<number> ) {
        this._index = index;
        if(index.x == 0) {
            this._relatedNodes.eastNode = index.x + 1; 
        }
        if(index.x > 0 && index.x < nodeArray.length - 1) {
            this._relatedNodes.westNode = index.x - 1;
            this._relatedNodes.eastNode = index.x + 1;
        }
        if(index.x == nodeArray.length - 1) {
            this._relatedNodes.westNode = index.x - 1;
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

    fill() : void {
        this._isFilled = true;
        //this.filledWith_ = id;
    }

    


}

export class Chain {
    nodes_: Array<ChainNode> = [];
    items_: Array<Item> = [];

    constructor(chainLayout: Array<number>, itemDestinationPoints: Array<Point>, itemSourcePoints: Array<Point> ) {
        for(let i = 0; i < chainLayout.length; i++) {
            this.nodes_[i] = new ChainNode( {x: i, y: 0}, chainLayout);
        }
        for(let i = 0; i < itemSourcePoints.length; i++) {
            let destPoint = itemDestinationPoints[i];
            let srcPoint = itemSourcePoints[i];
            this.items_[i] = new Item(destPoint, srcPoint); 
        }
        itemSourcePoints.forEach((point) => {
            this.includePoint(point);
        });
    }

    includePoint(point: Point) :Boolean {
        let hasPoint = false;
        this.nodes_.forEach((node) => {
            if(node.index.x == point.x && node.index.y == point.y) {
                    node.fill();
                    hasPoint = true;
                }
        });
        return hasPoint;
    }

    chainLength() : number {
        return this.nodes_.length;
    }

    printChain() : void {
        let chainStr : String = '';
        let chainLength = this.chainLength();
        console.log('len: ' + chainLength);
        for(let i = 0; i < chainLength; i++) {
            if (this.nodes_[i].isFilled) {
                chainStr += '[0]';
            } else {
                chainStr += '[-]';
            }
            if(i != chainLength - 1) {
                chainStr += '---';
            }
        }
        console.log('CHAIN: \n' + chainStr);
    }


    serializeCurrentState() {

    }

}

/**
{
    "chain": 
    [
        {
            "id": [0,0],
            "isFilled": false,
            "filledWith": null,
            "relatedNodes":  {
                northNode: null,
                southNode: null,
                westNode: null,
                eastNode: [0,1]
            }       
        },
        {
            "id": [0,1],
            "isFilled": true,
            "filledWith": 0,
            "relatedNodes":  {
                northNode: null,
                southNode: null,
                westNode: [0,0],
                eastNode: [0,2]
            }
        },
        {
            "id": [0,2],
            "isFilled": false,
            "filledWith": null,
            "relatedNodes":  {
                northNode: null,
                southNode: null,
                westNode: [0,1],
                eastNode: null
            }
        }
    ]
    
}
*/