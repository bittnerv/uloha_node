export interface Runnable {
    run(): Promise<void>;
    stop(): Promise<void>;
}

export class App {
    protected runnables: Array<Runnable> = [];

    public async run(): Promise<void> {
        try {
            await Promise.all(this.runnables.map((runnable) => runnable.run()));
        } catch (error) {
            console.info(`App error - ${error.name}: ${error.message}`);
            throw error;
        }
    }
}
