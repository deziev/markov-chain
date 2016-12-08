import { Point } from './ElementService';
import { Item } from './ElementService';

interface RelatedNodes {
    northNode: number;
    southNode: number;
    westNode: number;
    eastNode: number;
}


class ChainNode {
    index_: Point = {
        x: -1,
        y: -1
    };
    relatedNodes_: RelatedNodes = {
        northNode: null,
        southNode: null,
        westNode: null,
        eastNode: null
    }
    isFilled_: boolean = false;

    constructor(index: Point, nodeArray: Array<number> ) {
        this.index_ = index;
        if(index.x == 0) {
            this.relatedNodes_.eastNode = index.x + 1; 
        }
        if(index.x > 0 && index.x < nodeArray.length - 1) {
            this.relatedNodes_.westNode = index.x - 1;
            this.relatedNodes_.eastNode = index.x + 1;
        }
        if(index.x == nodeArray.length - 1) {
            this.relatedNodes_.westNode = index.x - 1;
        }
    }

    get relations() : RelatedNodes {
        return this.relatedNodes_;
    }

    get index() : Point {
        return this.index_;
    }

    get isFilled() : Boolean {
        //console.log('is filled: ' + this.isFilled_);
        //console.log('Index: ' + JSON.stringify(this.index) + '\nRel: ' + JSON.stringify(this.relations));
        return this.isFilled_;
    }

    fill() : void {
        this.isFilled_ = true;
    }

    


}

export class Chain {
    nodes_: Array<ChainNode> = [];
    items_: Array<Item> = [];

    constructor(chainLayout: Array<number>, itemDestinationPoints: Array<Point>, itemSourcePoints: Array<Point> ) {
        for(let i = 0; i < chainLayout.length; i++) {
            this.nodes_[i] = new ChainNode( {x: i, y: 0}, chainLayout);
        }
        itemSourcePoints.forEach((point) => {
            this.includePoint(point);
        });
        for(let i = 0; i < itemSourcePoints.length; i++) {
            let destPoint = itemDestinationPoints[i];
            let srcPoint = itemSourcePoints[i];
            this.items_[i] = new Item(destPoint, srcPoint); 
        }
    }

    includePoint(point: Point) :Boolean {
        let hasPoint = false;
        // console.log('Point: ' + JSON.stringify(point));
        // for(let i = 0; i < this.chainLength(); i++) {
        //     console.log('Node: ' + JSON.stringify(this.nodes_[i].index));
        //     if(point) {
        //         if(this.nodes_[i].index.x == point.x && this.nodes_[i].index.y == point.y) {
        //             console.log('WTf');
        //             this.nodes_[i].fill();
                
        //         }
        //     }
        // }
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

}