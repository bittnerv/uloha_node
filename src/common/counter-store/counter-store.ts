export interface CounterStore {
    get(key: string): Promise<number>;
    increment(key: string, value: number): Promise<void>;
}
