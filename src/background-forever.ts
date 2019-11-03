import { BackgroundForeverOptions } from './background-forever-options';
import { EventEmitter } from 'events';

export class BackgroundForever extends EventEmitter {
    private options: BackgroundForeverOptions;
    private continue: boolean;
    private running: boolean;
    constructor(private foreverFunction: () => Promise<any>, opts?: BackgroundForeverOptions) {
        super();
        this.options = {
            delayBetweenExecutionsMilliseconds: 1,
            stopSignalWaitToleranceMilliseconds: 30000,
            stopSignalPollFrequencyMilliseconds: 10
        };

        if (opts) {
            if (typeof opts.delayBetweenExecutionsMilliseconds === 'number') {
                this.options.delayBetweenExecutionsMilliseconds = opts.delayBetweenExecutionsMilliseconds;
            }
            if (typeof opts.stopSignalWaitToleranceMilliseconds === 'number') {
                this.options.stopSignalWaitToleranceMilliseconds = opts.stopSignalWaitToleranceMilliseconds;
            }
            if (typeof opts.stopSignalPollFrequencyMilliseconds === 'number') {
                this.options.stopSignalPollFrequencyMilliseconds = opts.stopSignalPollFrequencyMilliseconds;
            }
        }
    }
    public start(): void {
        this.continue = true;
        const bf = this;
        const run = () => {
            if (bf.continue) {
                bf.running = true;
                bf.emit('beforeRun');
                bf.foreverFunction().then((res) => {
                    bf.emit('runSuccess', res);
                }).catch((e) => {
                    bf.emit('runError', e);
                }).finally(() => {
                    setTimeout(run, bf.options.delayBetweenExecutionsMilliseconds);
                });
            } else {
                this.running = false;
            }
        };
    }
    public stop(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const maxMsWait = this.options.stopSignalWaitToleranceMilliseconds;
            const pollMs = this.options.stopSignalPollFrequencyMilliseconds;
            const waitToComplete = (msWaited: number) => {
                if (msWaited > maxMsWait) {
                    reject('Exceeded wait timeout');
                } else if (this.running) {
                    setTimeout(() => {
                        waitToComplete(msWaited + pollMs);
                    }, pollMs);
                } else {
                    resolve();
                }
            };
            waitToComplete(0);
        });
    }
}
