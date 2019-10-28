import {ActionHandler} from './action-handler';
import {Api} from './api';
import {HttpApiDescriptor} from './http-api-descriptor';
import {HttpApiHandler} from './http-api-handler';
import {HttpServer} from './http-server';

export class HttpApi<A, R> implements Api {
    constructor(
        private readonly httpServer: HttpServer,
        private readonly actionHandler: ActionHandler<A, R>,
        private readonly apiDescriptors: Array<HttpApiDescriptor<A, R>>,
    ) {
    }

    public async run(): Promise<void> {
        this.setupApi();
        await this.httpServer.listen();
    }

    public async stop(): Promise<void> {
        await this.httpServer.close();
    }

    private setupApi() {
        this.apiDescriptors.forEach((apiDescriptor) => this.addApi(apiDescriptor));
    }

    private addApi(apiDescriptor: HttpApiDescriptor<A, R>): void {
        this.httpServer.addRoute(
            apiDescriptor.route,
            new HttpApiHandler(this.actionHandler, apiDescriptor),
        );
    }
}
