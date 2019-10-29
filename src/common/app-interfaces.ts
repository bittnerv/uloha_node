export interface AppAction<R> {
    execute(...args: Array<unknown>): Promise<R>;
}

export interface AppLayer<A, R> {
    handle(action: A): Promise<R>;
}
