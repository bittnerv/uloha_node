import * as rp from 'request-promise-native';
import {testConfig} from '../mocks/test-config';

export interface RequesterConfig {
    host: string;
    port: number;
}

export interface RequestData {
    body?: unknown;
    query?: {[key: string]: string};
}

export class Requester {
    constructor(private readonly config: RequesterConfig) {
    }

    public async sendRequest(method: string, path: string, data: RequestData = {}): Promise<rp.FullResponse> {
        const {host, port} = this.config;
        const options: rp.OptionsWithUrl = {
            body: data.body,
            json: true,
            method,
            qs: data.query,
            resolveWithFullResponse: true,
            simple: false,
            url: `http://${host}:${port}${path}`,
        };

        return rp(options).promise();
    }
}

export function createApiRequester() {
    const {server: {host, port}} = testConfig;

    return new Requester({host, port});
}
