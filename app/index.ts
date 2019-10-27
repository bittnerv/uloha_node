import {TrackingApp} from './app';
import {config} from './config';

const app = new TrackingApp(config);

void app.run();
