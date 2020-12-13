import {StatusCodes} from 'http-status-codes';
import {HttpResponseAdapter, HttpResponseData} from '../http-response-adapter';

export class HttpEmptyResponseAdapter implements HttpResponseAdapter<void> {
    public async createResponseData(_: void): Promise<HttpResponseData> {
        return {status: StatusCodes.NO_CONTENT, body: {}};
    }

    public async createErrorResponseData(error: Error): Promise<HttpResponseData> {
        const body = {
            message: error.message,
            name: error.name,
        };

        return {status: StatusCodes.INTERNAL_SERVER_ERROR, body};
    }
}
