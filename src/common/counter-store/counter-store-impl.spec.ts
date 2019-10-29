import {expect} from 'chai';
import {RedisStoreMock} from '../../../test/mocks/redis-store-mock';
import {CounterStore} from './counter-store';
import {CounterStoreImpl} from './counter-store-impl';

describe('CounterStoreImpl', () => {
    const key = 'testKey';
    const value = 7;
    let redisStore: RedisStoreMock;
    let store: CounterStore;

    beforeEach(initializeStore);

    describe('when asked to get value', () => {
        it('should call get on redis store', async () => {
            await store.get(key);
            expect(redisStore.gets).to.deep.equal([key]);
        });

        it('should return result as number', async () => {
            await expect(store.get(key)).to.eventually.equal(Number(redisStore.stringValue));
        });
    });

    describe('when asked to increment value', () => {
        it('should call increment on redis store', async () => {
            await store.increment(key, value);
            expect(redisStore.increments).to.deep.equal([{key, value}]);
        });
    });

    function initializeStore() {
        redisStore = new RedisStoreMock();
        redisStore.stringValue = '5';
        store = new CounterStoreImpl(redisStore);
    }
});
