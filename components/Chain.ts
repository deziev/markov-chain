import { Point } from './ElementService';
import { Item } from './ElementService';
import { ChainNode } from './NodeService';

export class Chain {
    _nodes: ChainNode[][];
    _items: Array<Item> = [];

    constructor(chainLayout: Array<number>, itemDestinationPoints: Array<Point>, itemSourcePoints: Array<Point>, rows?: number) {
        this.initNodes(chainLayout, rows);
        this.initItems(itemDestinationPoints, itemSourcePoints);
    }

    initNodes(chainLayout: Array<number>, rows?: number) : void {
        if(!rows) {
            rows = 1;
        }
        this._nodes = [];
        for(let i = 0; i < rows; i++) {
            this._nodes[i] = [];
            for(let j = 0; j < chainLayout.length; j++) {
                this._nodes[i][j] = new ChainNode({
                    x: j, 
                    y: i
                }, 
                { 
                    rows: rows,
                    cols: chainLayout.length 
                });
            }
        }
    }

    initItems(itemDestinationPoints: Array<Point>, itemSourcePoints: Array<Point>) : void {
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
            //console.log('State: ' + item.checkItemIsReached())
            //console.log('Pos: ' + JSON.stringify(item.currentPosition));
            if(!item.checkItemIsReached()) {
                this.breadthFirstSearch(item);
                this.getNodeByPosition(item.currentPosition).release();

                item.makeStepAxisY(0);
    
                this.getNodeByPosition(item.currentPosition).fillWith(item.id);
                
            }
        });
    }

    breadthFirstSearch(item: Item) : void {
        let nodeQueue: Array<Point> = [];
        let visitedNodes: Array<Point> = [];
        let destinationPoint: Point = item.destination;

        nodeQueue.push(item.currentPosition);

        //loop
        for( let i = 0; i < 4; i++) {
            console.log('BFS: ' + JSON.stringify(nodeQueue));
            let nodePosition = nodeQueue.shift();
            visitedNodes.push(nodePosition);
            if(nodePosition != destinationPoint) {
                let node = this.getNodeByPosition(nodePosition);
                // get all chield nodes
                for(let prop in node.relations) {
                    let relatedNode = node.relations[prop];
                    if(relatedNode.length) {
                        
                        let relatedNodePosition : Point = {x: relatedNode[1], y: relatedNode[0] };
                        let isVisited = false;
                        visitedNodes.forEach(point => {
                            if(point.x == relatedNodePosition.x && point.y == relatedNodePosition.y) {
                                isVisited = true;
                            }         
                        });
                        //console.log('visited: ' + JSON.stringify(visitedNodes) + '\nbool: ' + isVisited);
                        if(!isVisited) {
                            nodeQueue.push(relatedNodePosition);
                        }
                    }
                }

            } else {
                console.log('Found!')
            }
        }
        
        //end loop
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
                //console.log('Node ' + JSON.stringify(this._nodes[i][j]._relatedNodes));
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
            "filledWith": NaN,
            "relatedNodes":  {
                northNode: [],
                southNode: [],
                westNode: [],
                eastNode: [0,1]
            }       
        },
        {
            "id": [0,1],
            "isFilled": true,
            "filledWith": 0,
            "relatedNodes":  {
                northNode: [],
                southNode: [],
                westNode: [0,0],
                eastNode: [0,2]
            }
        },
        {
            "id": [0,2],
            "isFilled": false,
            "filledWith": NaN,
            "relatedNodes":  {
                northNode: [],
                southNode: [],
                westNode: [0,1],
                eastNode: []
            }
        }
    ]
    
}
*/