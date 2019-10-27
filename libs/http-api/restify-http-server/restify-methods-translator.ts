// restify 4.x supports: ['del', 'get', 'head', 'opts', 'post', 'put', 'patch']
// https://github.com/restify/node-restify/blob/4.x/lib/server.js

import {HttpMethod} from '../http-server';

type RestifyMethod = 'del' | 'put' | 'post' | 'get' | 'patch' | 'opts' | 'head';

const restifyMethodsMap: {[key in HttpMethod]: RestifyMethod} = {
    [HttpMethod.Delete]: 'del',
    [HttpMethod.Put]: 'put',
    [HttpMethod.Post]: 'post',
    [HttpMethod.Get]: 'get',
    [HttpMethod.Patch]: 'patch',
};

export function translateToRestifyMethod(httpMethod: HttpMethod): RestifyMethod {
    return restifyMethodsMap[httpMethod];
}
