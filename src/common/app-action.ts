export interface AppAction<R> {
    execute(...args: Array<unknown>): Promise<R>;
}
