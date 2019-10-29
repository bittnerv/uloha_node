import {RedisStore} from '../../libs/redis-store/redis-store';

interface SimpleChange {
    key: string;
    value: string | number;
}

export class RedisStoreMock implements RedisStore {
    public stringValue = 'test';
    public numberValue = 5;
    public gets: Array<string> = [];
    public increments: Array<SimpleChange> = [];

    public async get(key: string): Promise<string> {
        this.gets.push(key);

        return this.stringValue;
    }

    public async set(_key: string, _value: string): Promise<void> {
        return;
    }

    public async increment(key: string, value: number): Promise<number> {
        this.increments.push({key, value});

        return this.numberValue;
    }
}
