import {expect} from 'chai';
import {spy, stub} from 'sinon';
import {ActionHandler} from './action-handler';
import {HttpActionAdapter} from './http-action-adapter';
import {HttpApiDescriptor} from './http-api-descriptor';
import {HttpApiHandler} from './http-api-handler';
import {HttpResponseAdapter} from './http-response-adapter';
import {HttpMethod, HttpRequest, HttpResponse} from './http-server';

const okStatus = 200;
const okBody = {value: 'result'};
const errorStatus = 500;
const errorBody = {error: 'test error'};

describe('HttpApiHandler', () => {
    let testAction: unknown;
    let testResult: unknown;
    let actionAdapter: HttpActionAdapter<unknown>;
    let responseAdapter: HttpResponseAdapter<unknown>;
    let actionHandler: ActionHandler<unknown, unknown>;
    let apiDescriptor: HttpApiDescriptor<unknown, unknown>;
    let handler: HttpApiHandler<unknown, unknown>;

    beforeEach(initalizeHandler);

    describe('when asked to handle http request', () => {
        let request: HttpRequest;
        let response: HttpResponse;

        beforeEach(initalizeRequestResponse);

        it('should prepare action from request', async () => {
            const createActionSpy = spy(actionAdapter, 'createAction');

            await handler.handle(request, response);

            expect(createActionSpy).to.be.calledOnceWith(request);
        });

        it('should handle action', async () => {
            const handleActionSpy = spy(actionHandler, 'handle');

            await handler.handle(request, response);

            expect(handleActionSpy).to.be.calledOnceWith(testAction);
        });

        it('should prepare response data from action result', async () => {
            const createResponseDataSpy = spy(responseAdapter, 'createResponseData');

            await handler.handle(request, response);

            expect(createResponseDataSpy).to.be.calledOnceWith(testResult);
        });

        it('should send response', async () => {
            const sendResponseSpy = spy(response, 'send');

            await handler.handle(request, response);

            expect(sendResponseSpy).to.be.calledOnceWith(okStatus, okBody);
        });

        describe('given handling is rejected with error', () => {
            const error = new Error('test error');

            beforeEach(() => stub(actionHandler, 'handle').rejects(error));

            it('should prepare error response data from error', async () => {
                const createErrorResponseDataSpy = spy(responseAdapter, 'createErrorResponseData');

                await handler.handle(request, response);

                expect(createErrorResponseDataSpy).to.be.calledOnceWith(error);
            });

            it('should send error response', async () => {
                const sendResponseSpy = spy(response, 'send');

                await handler.handle(request, response);

                expect(sendResponseSpy).to.be.calledOnceWith(errorStatus, errorBody);
            });
        });

        function initalizeRequestResponse() {
            request = {
                getBodyData: () => ({}),
                getRouteData: () => '',
                getQueryData: () => '',
            };
            response = {send: async () => undefined};
        }
    });

    function initalizeHandler() {
        testAction = 'testAction';
        testResult = 'testResult';
        actionHandler = {handle: async () => testResult};
        actionAdapter = {createAction: async () => testAction};
        responseAdapter = {
            createResponseData: async () => ({status: okStatus, body: okBody}),
            createErrorResponseData: async () => ({status: errorStatus, body: errorBody}),
        };
        apiDescriptor = {
            name: 'test',
            actionAdapter,
            responseAdapter,
            route: {path: 'test-path', method: HttpMethod.Get},
        };
        handler = new HttpApiHandler(actionHandler, apiDescriptor);
    }
});
