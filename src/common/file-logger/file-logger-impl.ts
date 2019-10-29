import {appendFile} from 'fs';
import {FileLogger} from './file-logger';

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
