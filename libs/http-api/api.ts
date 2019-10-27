export interface Api {
    run(): Promise<void>;
    stop(): Promise<void>;
}
