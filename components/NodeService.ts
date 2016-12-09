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
    _filledWith: number = NaN;

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

    release() : void {
        this._isFilled = false;
        this._filledWith = NaN;
    }


    fillWith(item: Item) : void {
        let nodePos: Point = this._index;
        if(nodePos.x == item.currentPosition.x && nodePos.y == item._currentPosition.y) {
            this._isFilled = true;
            this._filledWith = item.id;
        }
    }

}

export class Chain {
    _nodes: Array<ChainNode> = [];
    _items: Array<Item> = [];

    constructor(chainLayout: Array<number>, itemDestinationPoints: Array<Point>, itemSourcePoints: Array<Point> ) {
        for(let i = 0; i < chainLayout.length; i++) {
            this._nodes[i] = new ChainNode( {x: i, y: 0}, chainLayout);
        }
        for(let i = 0; i < itemSourcePoints.length; i++) {
            let destPoint = itemDestinationPoints[i];
            let srcPoint = itemSourcePoints[i];
            this._items[i] = new Item(i,destPoint, srcPoint);

            this._nodes.forEach(node => {
                node.fillWith(this._items[i]);
            });
        }
    }

    getNodeByItem (item: Item) : ChainNode {
        return this._nodes[item._currentPosition.x];
    }

    makeStep() : void {
        this._items.forEach(item => {
            console.log('State: ' + item.checkItemIsReached())
            if(!item.checkItemIsReached()) {
                this.getNodeByItem(item).release();

                item.makeStepAxisX(1);
    
                this.getNodeByItem(item).fillWith(item);
            }
        });
    }

    chainLength() : number {
        return this._nodes.length;
    }

    printChain() : void {
        // this._nodes.forEach(node => {
        //     console.log('Index: ' + JSON.stringify(node._index));
        // });
        let chainStr : String = '';
        let chainLength = this.chainLength();
        //console.log('len: ' + chainLength);
        for(let i = 0; i < chainLength; i++) {
            if (this._nodes[i].isFilled) {
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