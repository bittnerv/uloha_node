import {ActionHandler} from './action-handler';
import {HttpApiDescriptor} from './http-api-descriptor';
import {HttpResponseData} from './http-response-adapter';
import {HttpHandler, HttpRequest, HttpResponse} from './http-server';

export class HttpApiHandler<ACTION, RESULT> implements HttpHandler {
    constructor(private readonly actionHandler: ActionHandler<ACTION, RESULT>,
                private readonly apiDescriptor: HttpApiDescriptor<ACTION, RESULT>) {
    }

    public async handle(request: HttpRequest, response: HttpResponse): Promise<void> {
        try {
            const action = await this.prepareAction(request);
            const result = await this.actionHandler.handle(action);

            await this.processResult(response, result);
        } catch (error) {
            await this.processError(response, error);
        }
    }

    private sendReponse(response: HttpResponse, responseData: HttpResponseData): void {
        response.send(responseData.status, responseData.body);
    }

    private async prepareAction(request: HttpRequest): Promise<ACTION> {
        return this.apiDescriptor.actionAdapter.createAction(request);
    }

    private async processResult(response: HttpResponse, result: RESULT): Promise<void> {
        const {responseAdapter} = this.apiDescriptor;
        const responseData = await responseAdapter.createResponseData(result);

        this.sendReponse(response, responseData);
    }

    private async processError(response: HttpResponse, error: Error): Promise<void> {
        const {responseAdapter} = this.apiDescriptor;
        const responseData = await responseAdapter.createErrorResponseData(error);

        this.sendReponse(response, responseData);
    }
}
