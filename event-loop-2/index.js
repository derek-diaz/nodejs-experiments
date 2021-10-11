const sleep_st = (t) => new Promise((r) => setTimeout(r,t));
const sleep_im = () => new Promise((r) => setImmediate(r));

(async () => {
    setImmediate(() => console.log(1));
    console.log(2);
    await sleep_st(0);
    setImmediate(() => console.log(3));
    console.log(4);
    await sleep_im();
    console.log(6);
    await 1;
    setImmediate(() => console.log(7));
    console.log(8);
})();


setImmediate(() => console.log(1));
console.log(2);
Promise.resolve().then(() => setTimeout(() => {
    setImmediate(() => console.log(3));
    console.log(4);
    Promise.resolve().then(() => setImmediate(() => {
        setImmediate(() => console.log(5));
        console.log(6);
        Promise.resolve().then(() => {
            setImmediate(() => console.log(7));
            console.log(8);
        });
    }));
}, 0));


/*
Nodejs event loop 2

- Tick [] | Poll [] | Check [] | Timers []
- Tick [] | Poll [] | Check [1] | Timers []
- 2 is printed
- Tick [] | Poll [] | Check [1] | Timers [sleep_st]
- Tick [] | Poll [] | Check [3 1] | Timers [sleep_st]
- 4 is printed
- Tick [] | Poll [] | Check [sleep_im 3 1] | Timers [sleep_st]
- 6 is printed
- Tick [] | Poll [] | Check [sleep_im 3 1] | Timers [sleep_st]
- Tick [] | Poll [] | Check [7 sleep_im 3 1] | Timers [sleep_st]
- 8 is printed
-- Loop 1 ended


- Program output is:  2 4 6 8 1 3 7

 */