import { Chain } from './components/Chain';

let myChain = new Chain([0,1,2,3,4,5,6,7], 
                        [{x:3, y:0}, {x:1, y:1} ],
                        [{x:0, y:0}, {x:7, y:0}], 2
                        );

console.log(myChain.chainLength());
myChain.run();
myChain.printStats();
// myChain.printChain();


// myChain.makeStep();
// myChain.printChain();
// myChain.makeStep();
// myChain.printChain();
// myChain.makeStep();
// myChain.printChain();
// myChain.makeStep();
// myChain.printChain();
// myChain.makeStep();
// myChain.printChain();
