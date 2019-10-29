export interface FileLogger {
    log(text: string): Promise<void>;
}
