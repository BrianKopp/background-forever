# Background Forever

A simple utility to help you run node functions forever.

## Quick Start

```bash
npm install --save background-forever
```

```js
const BackgroundForever = new require('background-forever').BackgroundForever;
const bf = new BackgroundForever(() => {
    return new Promise((resolve, reject) => {
        console.log('hello world!');
        setTimeout(() => {
            resolve();
        }, 1000);
    });
});

bf.start();

setTimeout(() => {
    bf.stop().then(() => {
        console.log('stopped successfully!');
    }).catch((e) => {
        console.error('error occurred while stopping the function', e);
    });
}, 5000);

```

Using typescript:

```ts
import { BackgroundForever } from 'background-forever';

const bf = new BackgroundForever(() => {
    return new Promise<void>((resolve, reject) => {
        console.log('hello world!');
        setTimeout(() => {
            resolve();
        }, 1000);
    });
});

bf.start();

setTimeout(() => {
    bf.stop().then(() => {
        console.log('stopped successfully!');
    }).catch((e) => {
        console.error('error occurred while stopping the function', e);
    });
}, 5000);
```

## Events

`BackgroundForever` emits a number of events for you to keep track of.

### Before Run

`beforeRun` fires each time before calling your function.
The value is the run count, starting at 1.

```js
bf.on('beforeRun', (runCount) => {
    console.log(runCount); // 1
});
```

### Run Success

`runSuccess` fires after your function successfully resolves its returned
promise. The value is whatever your function returns.

```js
const bf = new BackgroundForever(() => {
    return new Promise((resolve, reject) => {
        console.log('hello world!');
        resolve('Howdy!');
    });
});

bf.on('runSuccess', (msg) => {
    console.log(msg); // Howdy!
});

bf.start();
```

### Run Error

`runError` fires if your function throws an error. The value in the event is
the error or Promise reject value.

```js
const bf = new BackgroundForever(() => {
    return new Promise((resolve, reject) => {
        reject('Fail!');
    });
});

bf.on('runError', (e) => {
    console.log(e); // Fail!
});

bf.start();
```
