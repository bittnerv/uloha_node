import {expect} from 'chai';
import {StatusCodes} from 'http-status-codes';
import {GetCount} from '../src/tracking/get-count';
import {TestActionHandler} from '../test/mocks/test-action-handler';
import {createTestApiLayer} from '../test/mocks/test-api-layer';
import {createTestAppLayer, TestAppLayer} from '../test/mocks/test-app-layer';
import {TestStore} from '../test/mocks/test-store';
import {createApiRequester} from '../test/utils/requester';

describe('GetCount', () => {
    describe('when asked to get count', () => {
         let store: TestStore;
         let appLayer: TestAppLayer;

         beforeEach(() => {
            store = new TestStore();
            appLayer = createTestAppLayer({store});
        });

         it('should return count', async () => {
            await expect(getCount()).to.eventually.equal(store.currentValue);
        });

         async function getCount(): Promise<number> {
            return appLayer.handle(new GetCount()) as Promise<number>;
        }
    });

    describe('when send GET /count request', () => {
        const result = 5;
        const requester = createApiRequester();
        const actionHandler = new TestActionHandler(result);
        const apiLayer = createTestApiLayer(actionHandler);

        before(() => apiLayer.run());
        after(() => apiLayer.stop());
        afterEach(() => actionHandler.reset());

        it('should return status OK', async () => {
            await expect(sendGetCountRequest()).to.eventually
                .have.property('statusCode', StatusCodes.OK);
        });

        it('should return number value', async () => {
            await expect(sendGetCountRequest()).to.eventually
                .have.deep.property('body', {value: result});
        });

        it('should produce GetCount action', async () => {
            await sendGetCountRequest();
            expect(actionHandler.handledActions).to.have.lengthOf(1);
            expect(actionHandler.getLastHandledAction()).to.be.instanceOf(GetCount);
        });

        describe('given action is handled with error', () => {
            const error = new Error('test error');

            beforeEach(() => (actionHandler.throwError = error));

            it('should return status INTERNAL SERVER ERROR', async () => {
                await expect(sendGetCountRequest()).to.eventually
                    .have.property('statusCode', StatusCodes.INTERNAL_SERVER_ERROR);
            });

            it('should return error description', async () => {
                await expect(sendGetCountRequest()).to.eventually
                    .have.deep.property('body', {message: error.message, name: error.name});
            });
        });

        async function sendGetCountRequest(): Promise<unknown> {
            return requester.sendRequest('get', '/count');
        }
    });
});
