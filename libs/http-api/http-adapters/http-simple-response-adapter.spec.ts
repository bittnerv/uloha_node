import {expect} from 'chai';
import {INTERNAL_SERVER_ERROR, OK} from 'http-status-codes';
import {HttpSimpleResponseAdapter} from './http-simple-response-adapter';

describe('HttpSimpleResponseAdapter', () => {
    const adapter = new HttpSimpleResponseAdapter();

    describe('when creating response data', () => {
        it('should return empty response', async () => {
            const value = 5;

            await expect(adapter.createResponseData(value)).to.eventually
                .deep.equal({status: OK, body: {value}});
        });
    });

    describe('when creating error response data', () => {
        it('should return INTERNAL SERVER ERROR response', async () => {
            const error = new Error('test-error');

            await expect(adapter.createErrorResponseData(error)).to.eventually
                .deep.equal({
                    body: {message: error.message, name: error.name},
                    status: INTERNAL_SERVER_ERROR,
                });
        });
    });
});
