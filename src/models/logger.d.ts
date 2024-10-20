import { IProxyConstructor } from "./proxy";
import { IFormatterConstructor } from "./formatter";
import { EnrichmentFields } from "./enrichment";
export interface ILogging {
    [key: string]: any|LogFunction;
    emit: () => Promise<any>;
    flush: () => Promise<any>;
}

export interface LoggerCustomization {
    proxy?: IProxyConstructor;
    formatter?: IFormatterConstructor;
    enrichmentFields?: EnrichmentFields;
}

export type LogFunction = (...args: any) => void;
