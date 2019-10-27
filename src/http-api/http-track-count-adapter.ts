import {HttpActionAdapter} from '../../libs/http-api';
import {HttpRequest} from '../../libs/http-api/http-server';
import {AppAction} from '../common/app-action';
import {TrackCount} from '../tracking/track-count';

export class HttpTrackCountAdapter implements HttpActionAdapter<AppAction<void>> {
    public async createAction(request: HttpRequest): Promise<AppAction<void>> {
        const body = request.getBodyData() as object;

        return new TrackCount({...body});
    }
}
