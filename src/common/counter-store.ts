import {RedisStore} from '../../libs/redis-store';

export interface CounterStore {
    get(key: string): Promise<number>;
    increment(key: string, value: number): Promise<void>;
}

export class CounterStoreImpl implements CounterStore {
    constructor(private readonly redisStore: RedisStore) {
    }

    public async get(key: string): Promise<number> {
        const result = this.redisStore.get(key);

        return Number(result);
    }

    public async increment(key: string, value: number): Promise<void> {
        await this.redisStore.increment(key, value);
    }
}
