import { Config } from '../../app/config';

export const testConfig: Config = {
    logPath: 'testlog.json',
    server: {
        name: 'test api server',
        host: 'localhost',
        port: 30000,
    },
    redis: {
        host: 'localhost',
        port: 6379,
    },
};
