import {Action, Result} from '../../src/action';
import {AppLayerImpl, AppResources} from '../../src/app-layer';
import {AppLayer} from '../../src/common/app-interfaces';
import {TestLogger} from './test-logger';
import {TestStore} from './test-store';

function createTestResources(resources?: Partial<AppResources>): AppResources {
    return {
        logger: new TestLogger(),
        store: new TestStore(),
        ...resources,
    };
}

export type TestAppLayer = AppLayer<Action, Result>;

export function createTestAppLayer(resources?: Partial<AppResources>): TestAppLayer {
    return new AppLayerImpl(createTestResources(resources));
}
