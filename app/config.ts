import {HttpServerConfig} from '../libs/http-api';
import {RedisConfig} from '../libs/redis-store/redis-connector';

export interface Config {
    logPath: string;
    server: HttpServerConfig;
    redis: RedisConfig;
}

export const config: Config =  {
    logPath: 'log.json',
    server: {
        name: 'api server',
        host: 'localhost',
        port: 50000,
    },
    redis: {
        host: 'localhost',
        port: 6379,
    },
};
