import {createServer, plugins, Request, RequestHandler, Response, Route, Server} from 'restify';
import {HttpHandler, HttpRoute, HttpServer, HttpServerConfig} from '../http-server';
import {RestifyHttpRequest} from './restify-http-request';
import {RestifyHttpResponse} from './restify-http-response';
import {translateToRestifyMethod} from './restify-methods-translator';

const DEFAULT_REQUEST_TIMEOUT_IN_SECONDS = 120;
const MS_IN_SECOND = 1000;

export class RestifyHttpServer implements HttpServer {
    private readonly restifyServer: Server;
    private initializingPromise: Promise<void> | undefined;

    public constructor(private readonly config: HttpServerConfig) {
        this.restifyServer = this.createRestifyServer();
    }

    public addRoute(route: HttpRoute, handler: HttpHandler): void {
        const restifyMethod = translateToRestifyMethod(route.method);

        this.restifyServer[restifyMethod](route, this.createRequestHandlerAdapter(handler));
    }

    public async listen(): Promise<void> {
        if (!this.initializingPromise) {
            this.initializingPromise = this.startListening()
                .catch((error) => this.handleListeningError(error));
        }

        return this.initializingPromise;
    }

    public async close(): Promise<void> {
        if (this.isListening()) {
            await new Promise((resolve) => this.restifyServer.close(resolve));
        }
    }

    private createRequestHandlerAdapter(handler: HttpHandler): RequestHandler {
        return async (request: Request, response: Response): Promise<void> => {
            return handler.handle(new RestifyHttpRequest(request), new RestifyHttpResponse(response));
        };
    }

    private isListening(): boolean {
        return this.restifyServer.server.listening;
    }

    private async startListening(): Promise<void> {
        const {port, host} = this.config;

        return new Promise<void>((resolve, reject) => {
            this.restifyServer.on('listening', resolve);
            this.restifyServer.on('error', reject);
            this.restifyServer.listen(port, host);
        });
    }

    private handleListeningError(error: Error): never {
        this.initializingPromise = undefined;

        throw error;
    }

    private createRestifyServer(): Server {
        const {name} = this.config;
        const restifyServer = createServer({name});

        restifyServer.use(plugins.fullResponse());
        restifyServer.use(plugins.queryParser());
        restifyServer.use(plugins.bodyParser({multiples: true}));
        restifyServer.on('uncaughtException', uncaughtExceptionHandler);
        this.setRequestTimeout(restifyServer);

        return restifyServer;
    }

    private setRequestTimeout(restifyServer: Server) {
        const timeoutInMs = DEFAULT_REQUEST_TIMEOUT_IN_SECONDS * MS_IN_SECOND;

        restifyServer.server.setTimeout(timeoutInMs, () => undefined);
    }
}

function uncaughtExceptionHandler(_request: Request, response: Response, _route: Route, error: Error) {
    console.info(`RestifyHttpServer: ${error.name}: ${error.message}`);
    response.send('Something is wrong, please try again later.');
}
