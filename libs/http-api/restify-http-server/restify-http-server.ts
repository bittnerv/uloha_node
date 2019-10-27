import {createServer, plugins, Request, RequestHandler, Response, Route, Server} from 'restify';
import {HttpHandler, HttpRoute, HttpServer, HttpServerConfig} from '../http-server';
import {RestifyHttpRequest} from './restify-http-request';
import {RestifyHttpResponse} from './restify-http-response';
import {translateToRestifyMethod} from './restify-methods-translator';

const DEFAULT_REQUEST_TIMEOUT_IN_SECONDS = 120;
const doNothing = () => undefined;

export class RestifyHttpServer implements HttpServer {
    private readonly restifyServer: Server;
    private initializingPromise: Promise<void> | undefined;

    public constructor(private readonly config: HttpServerConfig) {
        this.restifyServer = this.createRestifyServer();
        this.handleUncaughtExceptions();
    }

    public addRoute(route: HttpRoute, handler: HttpHandler): void {
        const restifyMethod = translateToRestifyMethod(route.method);

        this.restifyServer[restifyMethod](route, this.createRequestHandlerAdapter(handler));
    }

    public async listen(): Promise<void> {
        if (!this.initializingPromise) {
            this.initializingPromise = new Promise<void>((resolve, reject) => {
                this.startListening(resolve, reject);
            });
        }

        return this.initializingPromise;
    }

    public isListening(): boolean {
        return this.restifyServer.server.listening;
    }

    public async stopListening(): Promise<void> {
        if (this.isListening()) {
            await new Promise((resolve) => this.restifyServer.close(resolve));
        }
    }

    protected createRequestHandlerAdapter(handler: HttpHandler): RequestHandler {
        return async (request: Request, response: Response): Promise<void> => {
            return handler.handle(new RestifyHttpRequest(request), new RestifyHttpResponse(response));
        };
    }

    private startListening(resolve: () => void, reject: (error: Error) => void): void {
        const {port, host} = this.config;

        if (this.isListening()) {
            return resolve();
        }

        this.rejectWhenErrorIsEmitted(reject);
        this.resolveWhenListeningIsEmitted(resolve);

        this.restifyServer.listen(port, host, (error: Error) => {
            if (error) {
                return this.rejectListening(reject, error);
            }
        });
    }

    private rejectListening(reject: (error: Error) => void, error: Error) {
        this.initializingPromise = undefined;
        reject(error);
    }

    private resolveWhenListeningIsEmitted(resolve: () => void) {
        this.restifyServer.on('listening', resolve);
    }

    private rejectWhenErrorIsEmitted(reject: (error: Error) => void) {
        this.restifyServer.on('error', (error) => {
            this.rejectListening(reject, error);
        });
    }

    private createRestifyServer(): Server {
        const {name} = this.config;
        const restifyServer = createServer({name});

        restifyServer.use(plugins.fullResponse());
        restifyServer.use(plugins.queryParser());
        restifyServer.use(plugins.bodyParser({multiples: true}));

        this.setRequestHandlerTimeout(restifyServer);

        return restifyServer;
    }

    private setRequestHandlerTimeout(restifyServer: Server) {
        const msInSecond = 1000;
        const timeoutInMs = DEFAULT_REQUEST_TIMEOUT_IN_SECONDS * msInSecond;

        restifyServer.server.setTimeout(timeoutInMs, doNothing);
    }

    private handleUncaughtExceptions(): void {
        this.restifyServer.on('uncaughtException', this.uncaughtExceptionHandler);
    }

    private uncaughtExceptionHandler(_request: Request,
                                     response: Response,
                                     _route: Route,
                                     _error: Error) {
        response.send('Something is wrong, please try again later.');
    }
}
