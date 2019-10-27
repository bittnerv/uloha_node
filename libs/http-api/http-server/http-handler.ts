export interface HttpRequest {
    getBodyData(key?: string): unknown;
    getRouteData(key: string): string | undefined;
    getQueryData(key: string): string | undefined;
}

export interface HttpResponse {
    send(status: number, body: unknown): void;
}

export interface HttpHandler {
    handle(request: HttpRequest, response: HttpResponse): Promise<void>;
}
