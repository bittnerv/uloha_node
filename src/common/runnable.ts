export interface Runnable {
    run(): Promise<void>;
    stop(): Promise<void>;
}
