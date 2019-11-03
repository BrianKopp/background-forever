import { expect } from 'chai';
import { describe, it } from 'mocha';
import { BackgroundForever } from '../src';

describe('BackgroundForever unit tests', () => {
    it('should emit the beforeRun event', (done) => {
        const bf = new BackgroundForever(() => {
            return new Promise<void>((resolve, _) => {
                console.log('did hit promise');
                resolve();
            });
        }, { delayBetweenExecutionsMilliseconds: 5, stopSignalPollFrequencyMilliseconds: 1 });
        bf.on('beforeRun', (runCount) => {
            console.log('hit beforeRun event');
            expect(runCount).to.eql(1);
            bf.stop().then(() => {
                done();
            }).catch((e) => {
                done(e);
            });
        });
        console.log('starting');
        bf.start();
    });
    it('should emit the runSuccess event', (done) => {
        const bf = new BackgroundForever(() => {
            return new Promise<string>((resolve, _) => {
                console.log('did hit promise');
                resolve('msg');
            });
        }, { delayBetweenExecutionsMilliseconds: 5, stopSignalPollFrequencyMilliseconds: 1 });
        bf.on('runSuccess', (value) => {
            console.log('hit runSuccess event');
            expect(value).to.eql('msg');
            bf.stop().then(() => {
                done();
            }).catch((e) => {
                done(e);
            });
        });
        console.log('starting');
        bf.start();
    });
    it('should emit the runError event', (done) => {
        const bf = new BackgroundForever(() => {
            return new Promise<string>((_, reject) => {
                console.log('did hit promise');
                reject('msg');
            });
        }, { delayBetweenExecutionsMilliseconds: 5, stopSignalPollFrequencyMilliseconds: 1 });
        bf.on('runError', (err) => {
            console.log('hit runError event');
            expect(err).to.eql('msg');
            bf.stop().then(() => {
                done();
            }).catch((e) => {
                done(e);
            });
        });
        console.log('starting');
        bf.start();
    });
    it('it should fail on stop when tolerance times out', (done) => {
        const bf = new BackgroundForever(() => {
            return new Promise<string>((resolve, _) => {
                setTimeout(() => {
                    resolve();
                }, 50);
                console.log('did hit promise');
            });
        }, {
            delayBetweenExecutionsMilliseconds: 10,
            stopSignalPollFrequencyMilliseconds: 1,
            stopSignalWaitToleranceMilliseconds: 2 // this should cause timeout
        });
        bf.on('runSuccess', () => {
            console.log('hit runSuccess event');
            bf.stop().then(() => {
                done('should have timed out, but didn\'t');
            }).catch((e) => {
                expect(e).to.eql('Exceeded wait timeout');
                done();
            });
        });
        console.log('starting');
        bf.start();
    });
});
