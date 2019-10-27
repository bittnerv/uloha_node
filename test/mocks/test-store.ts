import {CounterStore} from '../../src/common/counter-store';

export interface Increment {
    key: string;
    value: number;
}

export class TestStore implements CounterStore {
    public increments: Array<Increment> = [];
    public currentValue: number = 2;

    public get lastIncrement(): Increment | null {
        return this.increments[this.increments.length - 1] || null;
    }

    public async increment(key: string, value: number): Promise<void> {
        this.increments.push({key, value});
    }

    public async get(_key: string): Promise<number> {
        return this.currentValue;
    }
}
