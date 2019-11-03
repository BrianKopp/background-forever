const BackgroundForever = new require('background-forever').BackgroundForever;
const bf = new BackgroundForever(() => {
    return new Promise((resolve, reject) => {
        console.log('hello world!');
        setTimeout(() => {
            resolve();
        }, 1000);
    });
});

bf.on('beforeRun', (runCount) => {
    console.log('preparing to start run #' + runCount);
});

bf.on('runSuccess', () => {
    console.log('finished my function');
});

bf.on('runError', (e) => {
    console.error('should not hit this event with my simple hello world function', e);
});

bf.start();

setTimeout(() => {
    bf.stop();
}, 5000);

/*
Outputs:
preparing to start run #1
hello world!
finished my function
preparing to start run #2
hello world!
finished my function
preparing to start run #3
hello world!
finished my function
preparing to start run #4
hello world!
finished my function
preparing to start run #5
hello world!
finished my function
*/