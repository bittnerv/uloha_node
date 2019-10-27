import {AppAction} from '../common/app-action';
import {CounterStore} from '../common/counter-store';

export class GetCount implements AppAction<number> {
    public readonly type: string = 'GetCount';
    private readonly countKey = 'count';

    public async execute(store: CounterStore): Promise<number> {
        return store.get(this.countKey);
    }
}
