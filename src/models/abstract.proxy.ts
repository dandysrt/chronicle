import { addLogFunction } from "../helpers/general";
import { ILoggerProxy, LogFunction } from "./proxy";

export default abstract class AbstractProxy implements ILoggerProxy {
    [key: string]: any|LogFunction;

    constructor(logLevels: string[]){
        for (const level of logLevels) {
            addLogFunction(this, level, this._log(level));
        }
    }

    protected abstract _log(level: string): LogFunction;
}
