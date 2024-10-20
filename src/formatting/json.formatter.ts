import { AbstractFormatter } from "../models/abstract.formatter";
import { createErrorObject, cycleGuard } from "../helpers/general";

export default class JsonFormatter extends AbstractFormatter<string[]> {
    messageKey = "message";

    private formatByType = {
        "string": (output: object, arg: any) => {
            output[this.messageKey] += ` ${arg}`;
        },
        "object": (output: object, arg: object) => {
            for (const key of Object.keys(arg)) {
                output[key] = arg[key];
            }
        },
        "number": (output: object, arg: any) => {
            output[this.messageKey] += ` ${arg}`;
        }
    }

    constructor(logLevels : string[]){
        super(logLevels);
    }

    set useKeys(_){ }

    get useKeys(): boolean {
        return false;
    }

    protected _log(level: string) {
        return (...args: (object|string|number)[]): string[] => {
            return [JSON.stringify(this.format(...args), cycleGuard())];
        }
    }

    format = (...args: (object|string|number)[]): object => {
        const output = {
            [this.messageKey]: ""
        };

        this.formattingOptions.useTimestamp && (output[this.formattingOptions.timeKey] = new Date().toISOString());

        for (let arg of args) {
            arg instanceof Error && (arg = createErrorObject(arg));
            this.formatByType[typeof arg](output, arg);
        }

        output[this.messageKey] = output[this.messageKey].trim();
        !output[this.messageKey] && (delete output[this.messageKey]);

        return output;
        // return [JSON.stringify(output, cycleGuard())];
    }
}
