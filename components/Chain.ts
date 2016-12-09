import { Point } from './ElementService';
import { Item } from './ElementService';
import { ChainNode } from './NodeService';

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

            this.getNodeByPosition(itemSourcePoints[i]).fillWith(this._items[i].id);
        }
    }

    getNodeByPosition (itemPos: Point ) : ChainNode {
        return this._nodes[itemPos.x];
    }

    makeStep() : void {
        this._items.forEach(item => {
            console.log('State: ' + item.checkItemIsReached())
            if(!item.checkItemIsReached()) {
                this.getNodeByPosition(item.currentPosition).release();

                item.makeStepAxisX(1);
    
                this.getNodeByPosition(item.currentPosition).fillWith(item.id);
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