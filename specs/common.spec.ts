import {expect} from 'chai';
import {NOT_FOUND} from 'http-status-codes';
import {AppAction} from '../src/common/app-interfaces';
import {TestActionHandler} from '../test/mocks/test-action-handler';
import {createTestApiLayer} from '../test/mocks/test-api-layer';
import {createTestAppLayer, TestAppLayer} from '../test/mocks/test-app-layer';
import {createApiRequester} from '../test/utils/requester';

class UnknownAction implements AppAction<void> {
    public async execute(): Promise<void> {
        return;
    }
}

describe('Common behavior', () => {
    describe('when ask to execute unsupported action', () => {
        let appLayer: TestAppLayer;
        let action: AppAction<void>;

        it('should reject with error', async () => {
            appLayer = createTestAppLayer();
            action = new UnknownAction();

            await expect(appLayer.handle(action)).to.rejectedWith(Error, `Unsupported action ${UnknownAction.name}`);
        });
    });

    describe('when sending request to unsupported route', () => {
        const unsupportedRoute = '/unsupported';
        const requester = createApiRequester();
        const actionHandler = new TestActionHandler();
        const apiLayer = createTestApiLayer(actionHandler);

        before(() => apiLayer.run());
        after(() => apiLayer.stop());

        it('should return status NOT FOUND', async () => {
            await expect(sendUnsupportedRequest()).to.eventually
                .have.property('statusCode', NOT_FOUND);
        });

        it('should return not found response', async () => {
            await expect(sendUnsupportedRequest()).to.eventually
                .to.have.deep.property('body', {
                    message: `${unsupportedRoute} does not exist`,
                    name: 'NotFound',
                  });
        });

        it('should produce TrackCount action', async () => {
            await sendUnsupportedRequest();
            expect(actionHandler.handledActions).to.have.lengthOf(0);
        });

        async function sendUnsupportedRequest(): Promise<unknown> {
            return requester.sendRequest('put', unsupportedRoute);
        }
    });
});
