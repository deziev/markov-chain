import { Chain } from './components/Chain';

let myChain = new Chain([0,1,2,3,4,5], 
                        [{x:1, y:0}, {x:0, y:1}],
                        [{x:3, y:0}, {x:2, y:1}], 2);

console.log(myChain.chainLength());
myChain.printChain();

myChain.makeStep();
myChain.printChain();
myChain.makeStep();
myChain.printChain();
myChain.makeStep();
myChain.printChain();
