import {AppLayerImpl} from '../src/app-layer';
import {App, Runnable} from '../src/common/app';
import {ActionHandlerImpl, HttpApiLayer} from '../src/http-api';
import {createApiResources} from './api-resources';
import {createAppResources} from './app-resources';
import {Config} from './config';

export class TrackingApp extends App {
    constructor(private readonly config: Config) {
        super();
        this.runnables = [this.prepareApiLayer()];
    }

    private prepareApiLayer(): Runnable {
        const appLayer = new AppLayerImpl(createAppResources(this.config));

        return new HttpApiLayer(createApiResources(this.config), new ActionHandlerImpl(appLayer));
    }
}
