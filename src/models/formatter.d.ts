import { AbstractFormatter } from "./abstract.formatter";
import { ErrorConfig } from "./public";

export interface IFormatter<F=any> {
    format: FormatterFunction<F>;
    errorConfig: ErrorConfig;
    formattingOptions: FormattingOptions;

    useKeys: boolean;

    [key: string]: any|FormatterFunction<F>;
}

export interface FormattingOptions {
    useTimestamp?: boolean;
    timeKey?: string;
}

export type IFormatterConstructor<T=any> = new (logLevels: string[]) => AbstractFormatter<T>;

type FormatterFunction<F> = (...args: any[]) => F;
