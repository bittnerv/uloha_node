import { HttpRequest } from './http-server';

export interface HttpActionAdapter<A> {
    createAction(request: HttpRequest): Promise<A>;
}
