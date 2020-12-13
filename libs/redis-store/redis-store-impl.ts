import {RedisClient} from 'redis';
import { RedisStore } from './redis-store';

export class RedisStoreImpl implements RedisStore {
    constructor(private readonly client: RedisClient) {
    }

    public async get(key: string): Promise<string> {
        return new Promise((resolve, reject) => {
            this.client.get(key, (error, value) => {
                error ? reject(error) : resolve(value || '');
            });
        });
    }

    public async set(key: string, value: string): Promise<void> {
        return new Promise((resolve, reject) => {
            this.client.set(key, value, (error) => {
                error ? reject(error) : resolve();
            });
        });
    }

    public async increment(key: string, value: number): Promise<number> {
        return new Promise((resolve, reject) => {
            this.client.incrbyfloat(key, value, (error, result) => {
                error ? reject(error) : resolve(Number(result));
            });
        });
    }
}
