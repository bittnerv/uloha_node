export interface ActionHandler<A, R> {
    handle(action: A): Promise<R>;
}
