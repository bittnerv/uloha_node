import {get, isString} from 'lodash';
import {Request} from 'restify';
import {HttpRequest} from '../http-server';

export class RestifyHttpRequest implements HttpRequest {
    public constructor(private readonly request: Request) {
    }

    public getBodyData(key?: string): unknown {
        if (key) {
            return get(this.request.body, key);
        } else {
            return this.request.body;
        }
    }

    public getRouteData(key: string): string | undefined {
        const value = this.request.params[key];

        return isString(value) ? value : undefined;
    }

    public getQueryData(key: string): string | undefined {
        const value = this.request.query[key];

        return isString(value) ? value : undefined;
    }
}
