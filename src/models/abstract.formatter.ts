import { FormatterFunction, FormattingOptions, IFormatter } from "./formatter";
import { addLogFunction } from "../helpers/general";
import { ErrorConfig } from "./public";

export abstract class AbstractFormatter<F> implements IFormatter {
    protected _useKeys: boolean = false;
    errorConfig: ErrorConfig = {};
    formattingOptions: FormattingOptions = {useTimestamp: true, timeKey: "@timestamp"};

    [key: string]: any|FormatterFunction<F>;

    constructor(logLevels: string[]){
        for (const level of logLevels) {
            addLogFunction(this, level, this._log(level));
        }
    }

    set useKeys(_: boolean) {
        this._useKeys = _;
    }

    get useKeys(): boolean {
        return this._useKeys;
    }

    protected abstract _log(level: string): FormatterFunction<F>;

    abstract format(...args: any[]): any;

    // format (...args: any[]): any {
    //     return this.format(...args);
    // };
}
