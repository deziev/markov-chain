import { Point } from './ElementService';
import { Item } from './ElementService';
import { ChainNode } from './NodeService';

export class Chain {
    _nodes: ChainNode[][];
    _items: Array<Item> = [];

    constructor(chainLayout: Array<number>, itemDestinationPoints: Array<Point>, itemSourcePoints: Array<Point>, demensions?: number) {
        if(!demensions) {
            demensions = 1;
        }
        this._nodes = [];
        for(let i = 0; i < demensions; i++) {
            this._nodes[i] = [];
            for(let j = 0; j < chainLayout.length; j++) {
                this._nodes[i][j] = new ChainNode( {x: j, y: i}, chainLayout);
            }
        }
        for(let i = 0; i < itemSourcePoints.length; i++) {
            let destPoint = itemDestinationPoints[i];
            let srcPoint = itemSourcePoints[i];
            this._items[i] = new Item(i,destPoint, srcPoint);

            this.getNodeByPosition(itemSourcePoints[i]).fillWith(this._items[i].id);
        }
    }

    getNodeByPosition (itemPos: Point ) : ChainNode {
        return this._nodes[itemPos.y][itemPos.x];
    }

    makeStep() : void {
        this._items.forEach(item => {
            console.log('State: ' + item.checkItemIsReached())
            if(!item.checkItemIsReached()) {
                this.getNodeByPosition(item.currentPosition).release();

                item.makeStepAxisX(-1);
    
                this.getNodeByPosition(item.currentPosition).fillWith(item.id);
            }
        });
    }

    chainLength() : Object {
        return { 
            d1: this._nodes.length,
            d2: this._nodes[0].length,
        }
    }

    printChain() : void {
        let chainStr : String = '';
        let chainSize = {
            d1: this._nodes.length,
            d2: this._nodes[0].length,
        };
        //console.log('len: ' + chainLength);
        for(let i = 0; i < chainSize.d1; i++) {
            for(let j = 0; j < chainSize.d2; j++) {
                if (this._nodes[i][j].isFilled) {
                    chainStr += '[0]';
                } else {
                    chainStr += '[-]';
                }
                if(j != chainSize.d2 - 1) {
                    chainStr += '---';
                }
            }
            if(chainSize.d1 > 1 && i != chainSize.d1 - 1) {
                chainStr += '\n';
                for(let j = 0; j < chainSize.d2; j++) {
                    chainStr += ' | ';
                    if(j != chainSize.d2 - 1) {
                        chainStr += '   ';
                    }
                }
            }
            chainStr += '\n';
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