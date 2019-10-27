import {HttpActionAdapter} from '../../libs/http-api';
import {HttpRequest} from '../../libs/http-api/http-server';
import {AppAction} from '../common/app-action';
import {GetCount} from '../tracking/get-count';

export class HttpGetCountAdapter implements HttpActionAdapter<AppAction<number>> {
    public async createAction(_request: HttpRequest): Promise<AppAction<number>> {
        return new GetCount();
    }
}
