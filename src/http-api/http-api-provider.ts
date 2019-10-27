import {httpAdapters, HttpApiDescriptor, HttpMethod} from '../../libs/http-api';
import {Action, Result} from '../action';
import {AppAction} from '../common/app-action';
import {HttpGetCountAdapter} from './http-get-count-adapter';
import {HttpTrackCountAdapter} from './http-track-count-adapter';

const {HttpEmptyResponseAdapter, HttpSimpleResponseAdapter} = httpAdapters;

export type HttpActionDescriptor<R> = HttpApiDescriptor<AppAction<R>, R>;

export class HttpApiProvider {
    public static getApiDescriptors(): Array<HttpApiDescriptor<Action, Result>> {
        const getCountDescriptor: HttpActionDescriptor<number> = {
            name: 'GetCount',
            actionAdapter: new HttpGetCountAdapter(),
            responseAdapter: new HttpSimpleResponseAdapter(),
            route: {
                path: '/count',
                method: HttpMethod.Get,
            },
        };

        const trackCountDescriptor: HttpActionDescriptor<void> = {
            name: 'TrackCount',
            actionAdapter: new HttpTrackCountAdapter(),
            responseAdapter: new HttpEmptyResponseAdapter(),
            route: {
                path: '/track',
                method: HttpMethod.Post,
            },
        };

        return [
            getCountDescriptor,
            trackCountDescriptor,
        ];
    }
}
