import AbstractProxy from "../models/abstract.proxy";
import { ILoggerProxy, LogBuffer, LogFunction } from "../models/proxy";

export default class BufferedConsoleProxy extends AbstractProxy implements ILoggerProxy{
    constructor(logLevels: string[], public buffer: LogBuffer<any> = []) {
        super(logLevels);
    }

    protected _log(level: string): LogFunction {
        return (...args) => {
            this.buffer.push([level, ...args]);
        }
    }

    emit = async () => {
        while (this.buffer.length) {
            const [level, ...args] = this.buffer.shift();
            console[level](...args);
        }
    }

    flush = async () => {
        this.buffer = [];
    }
}
