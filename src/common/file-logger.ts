import {appendFile} from 'fs';

export interface FileLogger {
    log(text: string): Promise<void>;
}

export class FileLoggerImpl implements FileLogger {
    constructor(private readonly path: string) {
    }

    public async log(text: string): Promise<void> {
        return new Promise((resolve, reject) => {
            appendFile(this.path, `${text}\n`, (error) => {
                error ? reject(error) : resolve();
            });
        });
    }
}
