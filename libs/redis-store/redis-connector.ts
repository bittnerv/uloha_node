import {createClient, RedisClient} from 'redis';
import {RedisStore} from './redis-store';
import {RedisStoreImpl} from './redis-store-impl';

export interface RedisConfig {
    host?: string;
    port: number;
}

export class RedisConnector {
    private readonly client: RedisClient;

    constructor(config: RedisConfig) {
        const {host, port} = config;

        this.client = createClient(port, host);
    }

    public getStore(): RedisStore {
        return new RedisStoreImpl(this.client);
    }
}
