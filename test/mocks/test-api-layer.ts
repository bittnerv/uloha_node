import {ActionHandler, RestifyHttpServer} from '../../libs/http-api';
import {Runnable} from '../../src/common/app';
import {ApiResources, HttpApiLayer} from '../../src/http-api';
import {testConfig} from './test-config';

function createTestResources(resources?: Partial<ApiResources>): ApiResources {
    return {
        httpServer: new RestifyHttpServer(testConfig.server),
        ...resources,
    };
}

export function createTestApiLayer(
    actionHandler: ActionHandler<any, any>,
    resources?: Partial<ApiResources>,
): Runnable {
    return new HttpApiLayer(createTestResources(resources), actionHandler);
}
