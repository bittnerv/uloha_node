import {ActionHandler} from '../../libs/http-api';

export class TestActionHandler implements ActionHandler<unknown, unknown> {
    public handledActions: Array<unknown> = [];
    public throwError?: Error = undefined;

    constructor(public actionResult?: unknown) {
    }

    public async handle(action: unknown): Promise<unknown> {
        this.handledActions.push(action);

        if (this.throwError) {
            throw this.throwError;
        }

        return this.actionResult;
    }

    public getLastHandledAction() {
        const count = this.handledActions.length;

        return this.handledActions[count - 1];
    }

    public reset() {
        this.handledActions = [];
    }
}
