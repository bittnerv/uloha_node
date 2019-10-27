import {HttpResponseAdapter, HttpResponseData} from '../http-response-adapter';

export class HttpEmptyResponseAdapter implements HttpResponseAdapter<void> {
    public async createResponseData(_: void): Promise<HttpResponseData> {
        return {status: 204, body: {}};
    }

    public async createErrorResponseData(error: Error): Promise<HttpResponseData> {
        const body = {
            error: `${error.name}: ${error.message}`,
        };

        return {status: 500, body};
    }
}
