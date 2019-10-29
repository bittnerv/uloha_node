import {ActionHandler} from '../../libs/http-api';
import {AppLayer} from './app-interfaces';

export class ApiActionHandler<A, R> implements ActionHandler<A, R> {
    constructor(private readonly appLayer: AppLayer<A, R>) {
    }

    public async handle(action: A): Promise<R> {
        return this.appLayer.handle(action);
    }
}
