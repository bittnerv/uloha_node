import {RedisConnector} from '../libs/redis-store';
import {AppResources} from '../src/app-layer';
import {CounterStoreImpl} from '../src/common/counter-store';
import {FileLoggerImpl} from '../src/common/file-logger';
import {Config} from './config';

export const createAppResources = (config: Config): AppResources => {
    const connector = new RedisConnector(config.redis);

    return {
        logger: new FileLoggerImpl(config.logPath),
        store: new CounterStoreImpl(connector.getStore()),
    };
};
