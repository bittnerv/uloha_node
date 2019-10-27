export interface HttpResponseData {
    status: number;
    body: unknown;
}

export interface HttpResponseAdapter<R> {
    createResponseData(result: R): Promise<HttpResponseData>;
    createErrorResponseData(error: Error): Promise<HttpResponseData>;
}
