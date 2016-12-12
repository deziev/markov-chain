import { Chain } from './components/Chain';

let myChain = new Chain([0, 2, 3, 4, 5, 6, 7], 
                        [{x:0, y:0}, {x:5, y:2}, {x:3, y:3}],
                        [{x:0, y:1}, {x:1, y:1}, {x:6, y:3}], 4
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
