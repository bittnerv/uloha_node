import {HttpActionAdapter} from './http-action-adapter';
import {HttpResponseAdapter} from './http-response-adapter';
import {HttpRoute} from './http-server';

export interface HttpApiDescriptor<A, R> {
    name: string;
    actionAdapter: HttpActionAdapter<A>;
    responseAdapter: HttpResponseAdapter<R>;
    route: HttpRoute;
}
