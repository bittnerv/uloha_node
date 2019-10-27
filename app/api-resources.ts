import {RestifyHttpServer} from '../libs/http-api';
import {ApiResources} from '../src/http-api';
import {Config} from './config';

export const createApiResources = (config: Config): ApiResources => {
    return {
        httpServer: new RestifyHttpServer(config.server),
    };
};
