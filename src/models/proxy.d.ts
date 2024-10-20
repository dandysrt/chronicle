import AbstractProxy from "./abstract.proxy";

export interface ILoggerProxy {
    [key: string]: any|LogFunction;
    emit?: () => Promise<any>;
    flush?: () => Promise<any>;
}

export type IProxyConstructor = new (logLevels: string[]) => AbstractProxy;

export interface LogBuffer<T> extends Iterable<T> {
    length: number;
    push(...args: T[]): void;
    shift(): T;
}

type LogFunction = (...args: any[]) => void;
