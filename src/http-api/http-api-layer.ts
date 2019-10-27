import {ActionHandler, HttpApi, HttpServer} from '../../libs/http-api';
import {Action, Result} from '../action';
import {Runnable} from '../common/app';
import {HttpApiProvider} from './http-api-provider';

export interface ApiResources {
    httpServer: HttpServer;
}

export class HttpApiLayer implements Runnable {
    private readonly httpApi: HttpApi<Action, Result>;

    constructor(apiResources: ApiResources, actionHandler: ActionHandler<Action, Result>) {
        const {httpServer} = apiResources;
        const apiDescriptors = HttpApiProvider.getApiDescriptors();

        this.httpApi = new HttpApi(httpServer, actionHandler, apiDescriptors);
    }

    public async run(): Promise<void> {
        await this.httpApi.run();
    }

    public async stop(): Promise<void> {
        await this.httpApi.stop();
    }
}
