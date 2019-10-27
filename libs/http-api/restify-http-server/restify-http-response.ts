import {Response} from 'restify';
import {HttpResponse} from '../http-server';

export class RestifyHttpResponse implements HttpResponse {
    public constructor(private readonly response: Response) {
    }

    public send(code: number, data: unknown): void {
        this.response.send(code, data);
    }
}
