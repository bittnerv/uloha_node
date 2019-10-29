import {FileLogger} from '../../src/common/file-logger/file-logger';

export class TestLogger implements FileLogger {
    public readonly logs: Array<string> = [];

    public get lastLog(): string | null {
        return this.logs[this.logs.length - 1] || null;
    }

    public async log(text: string): Promise<void> {
        this.logs.push(text);
    }
}
