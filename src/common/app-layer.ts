export interface AppLayer<A, R> {
    handle(action: A): Promise<R>;
}
