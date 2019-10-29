import {expect} from 'chai';
import * as redis from 'redis';
import {SinonStub, stub} from 'sinon';
import {RedisConfig, RedisConnector} from './redis-connector';
import {RedisStore} from './redis-store';

const config: RedisConfig = {
    host: 'localhost',
    port: 1234,
};

describe('RedisStore', () => {
    const value = 'testValue';
    const key = 'test';
    let client: redis.RedisClient;
    let clientStub: SinonStub;
    let store: RedisStore;

    beforeEach(stubRedis);
    afterEach(restoreRedisStub);
    beforeEach(initializeStore);

    it('connector should create client', () => {
        expect(clientStub).to.be.calledOnceWith(config.port, config.host);
    });

    describe('when asked to get value', () => {
        const callbackPosition = 1;
        let getStub: SinonStub;

        beforeEach(() => {
            getStub = stub(client, 'get').callsArgWith(callbackPosition, null, value);
        });

        it('should return value', async () => {
            await expect(store.get(key)).to.eventually.equal(value);
            expect(getStub).to.be.calledWith(key);
        });

        describe('and error is thrown', () => {
            let error: Error;

            beforeEach(simulateGetError);

            it('should reject with it', async () => {
                await expect(store.get(key)).to.be.rejectedWith(error);
            });

            function simulateGetError() {
                error = new Error('test error');
                getStub.callsArgWith(callbackPosition, error);
            }
        });
    });

    describe('when asked to set value', () => {
        const callbackPosition = 2;
        let setStub: SinonStub;

        beforeEach(() => {
            setStub = stub(client, 'set').callsArgWith(callbackPosition, null);
        });

        it('should set value', async () => {
            await expect(store.set(key, value)).to.be.fulfilled;
            expect(setStub).to.be.calledOnceWith(key, value);
        });

        describe('and error is thrown', () => {
            let error: Error;

            beforeEach(simulateSetError);

            it('should reject with it', async () => {
                await expect(store.set(key, value)).to.be.rejectedWith(error);
            });

            function simulateSetError() {
                error = new Error('test error');
                setStub.callsArgWith(callbackPosition, error);
            }
        });
    });

    describe('when asked to increment value', () => {
        const numberValue = 5;
        const incrementedValue = 8;
        const callbackPosition = 2;
        let incrementStub: SinonStub;

        beforeEach(() => {
            incrementStub = stub(client, 'incrbyfloat').callsArgWith(callbackPosition, null, incrementedValue);
        });

        it('should increment value', async () => {
            await expect(store.increment(key, numberValue)).to.eventually.equal(incrementedValue);
            expect(incrementStub).to.be.calledWith(key, numberValue);
        });

        describe('and error is thrown', () => {
            let error: Error;

            beforeEach(simulateIncrementError);

            it('should reject with it', async () => {
                await expect(store.increment(key, numberValue)).to.be.rejectedWith(error);
            });

            function simulateIncrementError() {
                error = new Error('test error');
                incrementStub.callsArgWith(callbackPosition, error);
            }
        });
    });

    function stubRedis() {
        client = {
            get: () => undefined,
            incrbyfloat: () => undefined,
            on: () => undefined,
            set: () => undefined,
        } as unknown as redis.RedisClient;
        clientStub = stub(redis, 'createClient').returns(client);
    }

    function restoreRedisStub() {
        clientStub.restore();
    }

    function initializeStore() {
        const connector = new RedisConnector(config);

        store = connector.getStore();
    }
});
