export interface RedisStore {
    get(key: string): Promise<string>;
    set(key: string, value: string): Promise<void>;
    increment(key: string, value: number): Promise<number>;
}
