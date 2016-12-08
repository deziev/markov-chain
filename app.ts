import { Chain } from './NodeService';

let myChain = new Chain([0,1,2,3,4,5], 
                        [{x:3, y:0}],
                        [{x:2, y:0}, {x:1, y:0}, {x:4, y:0}]);

myChain.printChain();