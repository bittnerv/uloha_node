import * as request from 'request-promise-native';
import {testConfig} from '../mocks/test-config';

const requestPresets = {
    json: true,
    resolveWithFullResponse: true,
    simple: false,
};

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

    public async sendRequest(method: string, path: string, data: RequestData = {}): Promise<request.FullResponse> {
        const {host, port} = this.config;
        const options: request.Options = {
            baseUrl: `http://${host}:${port}`,
            body: data.body,
            method,
            qs: data.query,
            url: path,
            ...requestPresets,
        };

        return request(options).promise();
    }
}

export function createApiRequester() {
    const {server: {host, port}} = testConfig;

    return new Requester({host, port});
}
