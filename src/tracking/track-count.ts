import {AppAction} from '../common/app-action';
import {CounterStore} from '../common/counter-store';
import {FileLogger} from '../common/file-logger';

export interface TrackCountData {
    count?: number;
    [key: string]: string | number | boolean | undefined;
}

export class TrackCount implements AppAction<void> {
    public readonly type: string = 'TrackCount';
    private readonly countKey = 'count';

    constructor(
        public readonly data: TrackCountData,
    ) {
    }

    public async execute(logger: FileLogger, store: CounterStore): Promise<void> {
        const {count} = this.data;

        await logger.log(JSON.stringify(this.data));

        if (count) {
            await store.increment(this.countKey, count);
        }
    }
}
