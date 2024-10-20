import { ErrorConfig } from "../models/public";

/**
 * @summary
 * @param {object} dest 
 * @param {string} name 
 * @param {Function} value 
 */
export const addLogFunction = (dest: object, name: string, value: Function) => {
    Object.defineProperty(
        dest,
        name,
        {
            value,
            writable: false
        }
    );
}

function rmCycle(k: string, v: any, seen: WeakSet<any>): any {
    if (typeof v === "object" && ![undefined, null].includes(v)) {
        if (seen.has(v)) {
            return;
        }
        seen.add(v);
    }
    return v;
}

export function cycleGuard() {
    const seen = new WeakSet<any>();
    return (key: string, value: any) => {
        return rmCycle(key, value, seen);
    }
}

export function createErrorObject(error: Error): object {
    const err = {};

    for (const k of Object.getOwnPropertyNames(error)){
        err[k] = error[k];
    }

    return err;
}

export function stringifyError(error: Error, {stackTrace=false, delim=' ', errorAttributes=[]}: ErrorConfig): string {
    let err = [];
    let errorParts = ["name", "cause", "message"];
    stackTrace && (errorParts = ["stack", "cause"]);
    errorParts.push(...errorAttributes);
    for (const k of errorParts) {
        const part = error[k];
        part && err.push(part);
    }

    return err.join(delim);
}
