import {expect} from 'chai';
import * as fs from 'fs';
import {SinonStub, stub} from 'sinon';
import {FileLogger} from './file-logger';
import {FileLoggerImpl} from './file-logger-impl';

describe('FileLoggerImpl', () => {
    const path = 'path/to/log';
    const text = 'test text';
    const callbackPosition = 2;
    let logger: FileLogger;

    beforeEach(initializeLogger);

    describe('when asked to log', () => {
        let appendStub: SinonStub;

        beforeEach(setStub);
        afterEach(restoreStub);

        it('should append line to log', async () => {
            await expect(logger.log(text)).to.be.fulfilled;
            expect(appendStub).to.be.calledWith(path, `${text}\n`);
        });

        describe('and error is thrown', () => {
            let error: Error;

            beforeEach(simulateAppendError);

            it('should reject with it', async () => {
                await expect(logger.log(text)).to.be.rejectedWith(error);
            });

            function simulateAppendError() {
                error = new Error('test error');
                appendStub.callsArgWith(callbackPosition, error);
            }
        });

        function setStub() {
            appendStub = stub(fs, 'appendFile').callsArg(callbackPosition);
        }

        function restoreStub() {
            appendStub.restore();
        }
    });

    function initializeLogger() {
        logger = new FileLoggerImpl(path);
    }
});
