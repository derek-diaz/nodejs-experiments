const fs = require('fs');

setImmediate(() => console.log(1));
Promise.resolve().then(() => console.log(2));
process.nextTick(() => console.log(3));
fs.readFile(__filename, () => {
    console.log(4);
    setTimeout(() => console.log(5));
    setImmediate(() => console.log(6));
    process.nextTick(() => console.log(7))
});
console.log(8);

/*
Node.js event loop
Poll -> Check -> Close -> Timers -> Pending
- BEFORE-POLL: tick always goes first on the loop (nextTick)
- POLL: executes stuff in promise queue (Promises)
- CHECK: then the check queue is executed (setImmediate)
- CLOSE: run any close events like closing a TCP event
- TIMERS: any setTimeouts or setIntervals are executed
- PENDING: special system events run here (throws) \

- Check Queue: entry [1] execute | Promise Queue: entry [] execute | Tick Queue: entry [] execute
- Check Queue: entry [1] execute | Promise Queue: entry [2] execute | Tick Queue: entry [] execute
- Check Queue: entry [1] execute | Promise Queue: entry [2] execute | Tick Queue: entry [3] execute
- Check Queue: entry [1] execute | Promise Queue: entry [readfile, 2] execute | Tick Queue: entry [3] execute
- 8 is printed on the screen
- On next loop tick is checked
- 3 is printed on the screen
- Check Queue: entry [1] execute | Promise Queue: entry [readfile, 2] execute | Tick Queue: entry [] execute
- We move to the poll state
- 2 is printed on the screen
- Check Queue: entry [1] execute | Promise Queue: entry [readfile] execute | Tick Queue: entry [] execute
- We move to the check step, Check queue is executed
- 1 is printed on the screen
- Check Queue: entry [] execute | Promise Queue: entry [readfile] execute | Tick Queue: entry [] execute
- We finish a loop here
- We now execute the promise queue
- 4 gets printed on the screen
- We add 5 to the timers queue
- Check Queue:  []  | Promise Queue:  []  | Tick Queue: [] | Timers queue: [5]
- Now we add 6 to the check queue
- Check Queue:  [6]  | Promise Queue:  []  | Tick Queue: [] | Timers queue: [5]
- 7 gets added to next tick
- Check Queue:  [6]  | Promise Queue:  []  | Tick Queue: [7] | Timers queue: [5]
- Loop is finished
- Tick gets executed and 7 is printed
- Check Queue:  [6]  | Promise Queue:  []  | Tick Queue: [] | Timers queue: [5]
- Check gets executed and 6 gets printed
- Check Queue:  []  | Promise Queue:  []  | Tick Queue: [] | Timers queue: [5]
- Timers gets executed and 5 is printed
- Check Queue:  []  | Promise Queue:  []  | Tick Queue: [] | Timers queue: []
- Program ends!
- Program output is 83214765
 */
