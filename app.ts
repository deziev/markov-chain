import { Chain } from './components/NodeService';

let myChain = new Chain([0,1,2,3,4,5], 
                        [{x:3, y:0}],
                        [{x:0, y:0}]);

myChain.printChain();
myChain.makeStep();
myChain.printChain();
