import { ILoggerProxy, LogFunction } from "../models/proxy";
import AbstractProxy from "../models/abstract.proxy";

export default class ConsoleProxy extends AbstractProxy implements ILoggerProxy {
    constructor(logLevels: string[]) {
        super(logLevels);
    }

    protected _log(level: string): LogFunction {
        return console[level];
    }
}
