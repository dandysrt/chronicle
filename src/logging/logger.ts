import EnrichmentEngine from "../enrichment/enrichment.engine";
import DefaultFormatter from "../formatting/default.formatter";
import GarbageCollection from "../helpers/garbage.collection";
import { addLogFunction } from "../helpers/general";
import { AbstractFormatter } from "../models/abstract.formatter";
import AbstractProxy from "../models/abstract.proxy";
import { ILogging, LogFunction, LoggerCustomization } from "../models/logger";
import ConsoleProxy from "../proxy/console.proxy";

export default class Logger implements ILogging {
    [key: string]: any|LogFunction;
    private proxy: AbstractProxy;
    private formatter: AbstractFormatter<any>;

    constructor(
        logLevels: string[],
        {
            proxy=ConsoleProxy,
            formatter=DefaultFormatter,
            enrichmentFields=[]
        }: LoggerCustomization={}
    ) {
        this.proxy = new proxy(logLevels);
        this.formatter = new formatter(logLevels);
        EnrichmentEngine.formatter = this.formatter as any;
        this.enrichment = EnrichmentEngine.enrichmentFields(...enrichmentFields);

        GarbageCollection.hint(this, this.enrichment.key);

        for (const level of logLevels) {
            addLogFunction(this, level, this._log(level));
        }
    }

    private _log = (level: string) => {
        if (!this.formatter[level]) {
            throw new Error(`${this.formatter.constructor.name} has no level ${level}.`);
        }

        if (!this.proxy[level]) {
            throw new Error(`${this.proxy.constructor.name} has no level ${level}`);
        }

        return (...args: any[]) => {
            this.proxy[level](...this.formatter[level](...args, ...this.enrichment.getFields()));
        }
    }

    emit = async (): Promise<void> => {
        this.proxy.emit?.();
    }

    flush = async (): Promise<void> => {
        this.proxy.flush?.();
    }
}
