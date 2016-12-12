import { IPoint } from './primitives/IPoint';
import { Point } from './primitives/Point';
import { Item } from './ElementService';
import { ChainNode } from './NodeService';

import appconfig from '../config/appconfig';

export class Chain {
    _nodes: ChainNode[][];
    _items: Array<Item> = [];
    _stepCounter: number = 0;

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
        this._items.forEach((item, index) => {
            if(!item.checkItemIsReached()) {

                this.getNodeByPosition(item.currentPosition).release();
                let nextNodePosition = this.breadthFirstSearch(item);

                let nextXY = this.calcNextStep(item.currentPosition, nextNodePosition);

                item.changePosition(nextXY);

                this.getNodeByPosition(item.currentPosition).fillWith(item.id);
                
            } else {
                item.isReached = true;
            }
        });
    }

    makeStepByItem(index: number) : void {
        let item = this._items[index];
        if(!item.checkItemIsReached()) {

            this.getNodeByPosition(item.currentPosition).release();
            let nextNodePosition: Point = null;

            if(appconfig.movement == 'BFS') {
                nextNodePosition = this.breadthFirstSearch(item);
            } else if (appconfig.movement == 'random') {
                nextNodePosition = this.randomStep(item);
            }
            

            let nextXY = this.calcNextStep(item.currentPosition, nextNodePosition);

            item.changePosition(nextXY);

            this.getNodeByPosition(item.currentPosition).fillWith(item.id);
            
        } else {
            item.isReached = true;
        }
    }

    calcNextStep(currentPosition: Point , nextNode: Point) : IPoint {
        let diffXY: IPoint = {
            x: nextNode.x - currentPosition.x,
            y: nextNode.y - currentPosition.y
        };
        return diffXY;
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
            //console.log('\nBFS: ' + JSON.stringify(nodeQueue));
            //console.log('visited: ' + JSON.stringify(visitedNodes)); 
            let nodePosition = nodeQueue.shift();

            visitedNodes.push(nodePosition);
            if(!nodePosition.equalTo(destination)) {
                console.log('curr: ' + nodePosition.x + ', ' + nodePosition.y);
                let node = this.getNodeByPosition(nodePosition);

                console.log('Rels: ' + JSON.stringify(node.relations));
                
                for(let prop in node.relations) {
                    let relatedNode = node.relations[prop];
                    if(relatedNode && !this.getNodeByPosition(relatedNode).isFilled) {
                        
                        let isVisited = 
                        visitedNodes.some((point) : boolean => {
                            return point.equalTo(relatedNode);  
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
        if(!nextStep) {
            nextStep = this.randomStep(item) || item.currentPosition;
        }

        return nextStep;
    }

    getPrevNode(visitedNodes: Array<Point>, destination: Point) : Point {
        let node = this.getNodeByPosition(destination);
        let prevNode = null;
        for(let prop in node.relations) {
            let relatedNode = node.relations[prop];
            if(relatedNode && !this.getNodeByPosition(relatedNode).isFilled) {
                visitedNodes.forEach(point => {
                    if(point.equalTo(relatedNode)) {
                        prevNode = new Point(point.x, point.y)
                    }
                });
            }
        }
        return prevNode;
    }

    randomStep(item: Item) : Point {
        let position = item.currentPosition;
        let node = this.getNodeByPosition(position);
        let relatedNodes: Array<Point> = [];
        let pickChance: Array<number> = [];
        for(let prop in node.relations) {
            let relatedNode = node.relations[prop];
            if(relatedNode && !this.getNodeByPosition(relatedNode).isFilled) {
                relatedNodes.push(relatedNode);
                pickChance.push(Math.random());
            }
        }
        let indexOfMaxChance = pickChance.indexOf(Math.max(...pickChance)); 
        return relatedNodes[indexOfMaxChance];
    }




    chainLength() : Object {
        return { 
            d1: this._nodes.length,
            d2: this._nodes[0].length,
        }
    }

    printChain() : void {
        let chainStr : String = '';
        console.log('STEP: ' + this._stepCounter);
        
        let chainSize = {
            d1: this._nodes.length,
            d2: this._nodes[0].length,
        };

        for(let i = 0; i < chainSize.d1; i++) {
            for(let j = 0; j < chainSize.d2; j++) {
                if (appconfig.horizontalLoop && !j) {
                    chainStr += '---';
                }
                if (this._nodes[i][j].isFilled) {
                    chainStr += '[' + this._nodes[i][j].filledWith +']';
                } else {
                    chainStr += '[-]';
                }
                if (j != chainSize.d2 - 1) {
                    chainStr += '---';
                } else if (appconfig.horizontalLoop) {
                    chainStr += '---';
                }
            }
            if (chainSize.d1 > 1 && i != chainSize.d1 - 1 || appconfig.verticalLoop) {
                chainStr += '\n';
                if (appconfig.horizontalLoop) {
                    chainStr += '   ';
                }   
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

    printStats() : void {
        console.log('Stats:');
        var stepSum: number = 0;
        this._items.forEach((item, index) => {
            stepSum += item.stepCount; 
            console.log('Item ' + index +' steps: '+ item.stepCount);
              
        });
        let avgStep = stepSum / this._items.length;
        console.log('AVG: ' + avgStep);   
        console.log('Steps: ' + this._stepCounter);  
    }

    // serializeCurrentState() {

    // }

    run() {
        this.printChain();
        let itemPerStep = appconfig.itemPerStep || this._items.length;
        while(!this.checkIsItemsReached()) {
            for(let index = 0; index < this._items.length; index++) {
                this.makeStepByItem(index);
                if( (index + 1) % itemPerStep == 0 && !this._items[index].isReached) {
                    this._stepCounter++;
                    this.printChain();
                }
            }
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