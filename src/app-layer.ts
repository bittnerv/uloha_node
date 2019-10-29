import {Action, Result} from './action';
import {AppLayer} from './common/app-interfaces';
import {CounterStore} from './common/counter-store';
import {FileLogger} from './common/file-logger';
import {GetCount} from './tracking/get-count';
import {TrackCount} from './tracking/track-count';

export interface AppResources {
    logger: FileLogger;
    store: CounterStore;
}

export class AppLayerImpl implements AppLayer<Action, Result> {
    constructor(private readonly resources: AppResources) {
    }

    public async handle(action: Action): Promise<Result> {
        const {logger, store} = this.resources;

        if (action instanceof TrackCount) {
            return action.execute(logger, store);
        }

        if (action instanceof GetCount) {
            return action.execute(store);
        }

        throw new Error(`Unsupported action ${action.constructor.name}`);
    }
}
