import {HttpResponseAdapter, HttpResponseData} from '../http-response-adapter';

export type SimpleResult = string | number | boolean;

export class HttpSimpleResponseAdapter implements HttpResponseAdapter<SimpleResult> {
    public async createResponseData(value: SimpleResult): Promise<HttpResponseData> {
        return {status: 200, body: {value}};
    }

    public async createErrorResponseData(error: Error): Promise<HttpResponseData> {
        const body = {
            message: error.message,
            name: error.name,
        };

        return {status: 500, body};
    }
}
