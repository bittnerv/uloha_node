import {ActionHandler} from '../../libs/http-api';
import {AppLayer} from '../common/app-layer';

export class ActionHandlerImpl<A, R> implements ActionHandler<A, R> {
    constructor(private readonly appLayer: AppLayer<A, R>) {
    }

    public async handle(action: A): Promise<R> {
        return this.appLayer.handle(action);
    }
}
