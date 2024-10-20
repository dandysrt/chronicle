import { cycleGuard, stringifyError } from "../helpers/general";
import { AbstractFormatter } from "../models/abstract.formatter";

export default class DefaultFormatter extends AbstractFormatter<string[]> {
    constructor(logLevels: string[]) {
        super(logLevels);
    }
    
    set useKeys(_: boolean) { }

    get useKeys(): boolean {
        return false;
    }

    protected _log(_: string) {
        return (...args: any[]): string[] => {
            return this.format(...args);
        }
    }

    format = (...args: any[]): string[] => {
        let output: string[] = [];
        this.formattingOptions.useTimestamp && output.push(new Date().toISOString());

        for (let arg of args) {
            arg instanceof Error && (arg = stringifyError(arg, this.errorConfig))
            typeof arg === "object" && (arg = JSON.stringify(arg, cycleGuard()));
            output.push(arg);
        }

        return output;
    }
}
