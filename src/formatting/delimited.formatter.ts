import { cycleGuard, stringifyError } from "../helpers/general";
import { AbstractFormatter } from "../models/abstract.formatter";

export default class DelimitFormatter extends AbstractFormatter<string[]> {
    constructor(logLevels : string[], private delimiter=" ") {
        super(logLevels);
    }

    private setTimestamp(output: any[]) {
        if (this.formattingOptions.useTimestamp) {
            if (this.useKeys) {
                output.push(`${this.formattingOptions.timeKey}=${new Date().toISOString()}`);
            } else {
                output.push(new Date().toISOString());
            }
        }
    }

    protected _log(_: string) {
        return (...args: any[]): string[] => {
            return [this.format(...args).join()];
        }
    }

    format = (...args: any[]): string[] => {
        const output = [];
        this.setTimestamp(output);
        for (let arg of args) {
            if (arg instanceof Error) {
                arg = stringifyError(arg, this.errorConfig);
            }

            if (typeof arg === "object") {
                arg = JSON.stringify(arg, cycleGuard());
            }

            output.push(arg, this.delimiter);
        }
        output.pop();
        
        return output;
    }
}
