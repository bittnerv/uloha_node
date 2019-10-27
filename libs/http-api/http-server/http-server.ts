import {HttpHandler} from './http-handler';
import {HttpRoute} from './http-route';

export interface HttpServerConfig {
    name: string;
    host: string;
    port: number;
}

export interface HttpServer {
    listen(): Promise<void>;
    stopListening(): Promise<void>;
    addRoute(route: HttpRoute, handler: HttpHandler): void;
}
