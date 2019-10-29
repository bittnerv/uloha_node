import {expect} from 'chai';
import {INTERNAL_SERVER_ERROR, NO_CONTENT} from 'http-status-codes';
import {TrackCount, TrackCountData} from '../src/tracking/track-count';
import {TestActionHandler} from '../test/mocks/test-action-handler';
import {createTestApiLayer} from '../test/mocks/test-api-layer';
import {createTestAppLayer, TestAppLayer} from '../test/mocks/test-app-layer';
import {TestLogger} from '../test/mocks/test-logger';
import {TestStore} from '../test/mocks/test-store';
import {createApiRequester} from '../test/utils/requester';

describe('TrackCount', () => {
    describe('when asked to track count', () => {
        let logger: TestLogger;
        let store: TestStore;
        let appLayer: TestAppLayer;

        beforeEach(() => {
            logger = new TestLogger();
            store = new TestStore();
            appLayer = createTestAppLayer({logger, store});
        });

        it('should log data', async () => {
            const data = {key: 'abc'};

            await trackCount(data);

            expect(logger.lastLog).to.equal(JSON.stringify(data));
        });

        it('should increment count if present', async () => {
            const count = 12;

            await trackCount({count});

            expect(store.lastIncrement).to.deep.equal({
                key: 'count',
                value: count,
            });
        });

        it('should not increment count if not present', async () => {
            await trackCount({});

            expect(store.lastIncrement).to.equal(null);

        });

        async function trackCount(data: TrackCountData): Promise<void> {
            return appLayer.handle(new TrackCount(data)) as Promise<void>;
        }
    });

    describe('when send POST /track request', () => {
        const body = {key: 'value', count: 5};
        const requester = createApiRequester();
        const actionHandler = new TestActionHandler();
        const apiLayer = createTestApiLayer(actionHandler);

        before(() => apiLayer.run());
        after(() => apiLayer.stop());
        afterEach(() => actionHandler.reset());

        it('should return status NO CONTENT', async () => {
            await expect(sendTrackCountRequest()).to.eventually
                .have.property('statusCode', NO_CONTENT);
        });

        it('should return nothing', async () => {
            await expect(sendTrackCountRequest()).to.eventually
                .not.to.have.property('body');
        });

        it('should produce TrackCount action', async () => {
            await sendTrackCountRequest();
            expect(actionHandler.handledActions).to.have.lengthOf(1);
            expect(actionHandler.getLastHandledAction())
                .to.be.instanceOf(TrackCount).and
                .to.have.deep.property('data', body);
        });

        describe('given action is handled with error', () => {
            const error = new Error('test error');

            beforeEach(() => (actionHandler.throwError = error));

            it('should return status INTERNAL SERVER ERROR', async () => {
                await expect(sendTrackCountRequest()).to.eventually
                    .have.property('statusCode', INTERNAL_SERVER_ERROR);
            });

            it('should return error description', async () => {
                await expect(sendTrackCountRequest()).to.eventually
                    .have.deep.property('body', {message: error.message, name: error.name});
            });
        });

        async function sendTrackCountRequest(): Promise<unknown> {
            return requester.sendRequest('post', '/track', {body});
        }
    });
});
