import { Point } from './ElementService';
import { IPoint } from './ElementService';
import { Item } from './ElementService';
import { ChainNode } from './NodeService';

export class Chain {
    _nodes: ChainNode[][];
    _items: Array<Item> = [];

    constructor(chainLayout: Array<number>, itemDestinationPoints: Array<IPoint>, itemSourcePoints: Array<IPoint>, rows?: number) {
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

    initItems(itemDestinationPoints: Array<IPoint>, itemSourcePoints: Array<IPoint>) : void {
        for(let i = 0; i < itemSourcePoints.length; i++) {
            let destPoint = itemDestinationPoints[i];
            let srcPoint = itemSourcePoints[i];
            this._items[i] = new Item(i,destPoint, srcPoint);
            this.getNodeByPosition(itemSourcePoints[i]).fillWith(this._items[i].id);
        }
    }

    getNodeByPosition (itemPos: IPoint ) : ChainNode {
        return this._nodes[itemPos.y][itemPos.x];
    }

    checkIsItemsReached() : boolean {
        for(let i = 0; i < this._items.length; i++) {
            if(!this._items[i].isReached) {
                return false;
            }
        }
        return true;
    }

    makeStep() : void {
        this._items.forEach(item => {
            if(!item.checkItemIsReached()) {

                let nextNodePosition = this.breadthFirstSearch(item);
                let nextXY = this.calcNextStep(item.currentPosition, nextNodePosition);

                this.getNodeByPosition(item.currentPosition).release();

                item.makeStepAxisX(nextXY[0]);
                item.makeStepAxisY(nextXY[1]);
    
                this.getNodeByPosition(item.currentPosition).fillWith(item.id);
                
            } else {
                item.isReached = true;
            }
        });
    }


    calcNextStep(currentPosition: Point , nextNode: Point) : Array<number> {
        let diffArray: Array<number> = [];
        diffArray[0] = nextNode.x - currentPosition.x;
        diffArray[1] = nextNode.y - currentPosition.y;
        return diffArray;
    }


    breadthFirstSearch(item: Item) : Point {
        let nodeQueue: Array<Point> = [];
        let visitedNodes: Array<Point> = [];
        let nextStep: Point = null;
        // actually search is reversed, form dest to curr
        // last visited node will be our next step
        let destination = new Point(item.currentPosition.x, item.currentPosition.y);
        let currentPosition = new Point(item.destination.x, item.destination.y);

        nodeQueue.push(currentPosition);
        //loop
        while(nodeQueue.length) {
            console.log('\nBFS: ' + JSON.stringify(nodeQueue));
            console.log('visited: ' + JSON.stringify(visitedNodes)); 
            let nodePosition = nodeQueue.shift();

            visitedNodes.push(nodePosition);
            if(!nodePosition.equalTo(destination)) {
                //console.log('curr: ' + nodePosition.x + ', ' + nodePosition.y);
                let node = this.getNodeByPosition(nodePosition);
  
                for(let prop in node.relations) {
                    let relatedNode = node.relations[prop];
                    if(relatedNode) {
                        
                        let isVisited = 
                        visitedNodes.some((point) : boolean => {
                            return point.equalTo(relatedNode)  
                        });
                        let alreadyInQueue = 
                        nodeQueue.some((point) : boolean => {
                                return point.equalTo(relatedNode);
                        });

                        if(!isVisited && !alreadyInQueue) {
                            nodeQueue.push(relatedNode);
                        }
                    }
                }

            } else {
                
                //console.log('Found!');
                nextStep = this.getPrevNode(visitedNodes, nodePosition);
                //console.log('visited: ' + JSON.stringify(visitedNodes)); 
                break;
            }
        }

        return nextStep;
    }

    getPrevNode(visitedNodes: Array<Point>, destination: Point) : Point {
        let node = this.getNodeByPosition(destination);
        let prevNode = null;
        for(let prop in node.relations) {
            let relatedNode = node.relations[prop];
            if(relatedNode) {
                visitedNodes.forEach(point => {
                    if(point.equalTo(relatedNode)) {
                        prevNode = new Point(point.x, point.y)
                    }
                });
            }
        }
        return prevNode;
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

    // serializeCurrentState() {

    // }

    run() {
        while(!this.checkIsItemsReached()) {
            this.printChain();
            this.makeStep();
        }
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