import { AsyncLocalStorage } from "node:async_hooks";
import LogEnrichment from "./log.enrichment";
import DefaultFormatter from "../formatting/default.formatter";
import { randomUUID } from "node:crypto";
import { EnrichmentFields } from "../models/enrichment";

export default class EnrichmentEngine {
    private static asyncLocalStorage = new AsyncLocalStorage();
    public static readonly enrichmentMap = new Map<string, LogEnrichment>();

    public static formatter = new DefaultFormatter([]);

    static enrichmentFields = (...fields: EnrichmentFields): LogEnrichment => {
        const enrichment = LogEnrichment.withDefaultFields(this.getContext() || randomUUID(), this.formatter, ...fields);
        this.enrichmentMap.set(enrichment.key, enrichment);
        
        return enrichment;
    }

    static runInContext = (store: any, callback: () => unknown): void => {
        this.asyncLocalStorage.run(store, callback);
    }

    static getContext = (): any => {
        return this.asyncLocalStorage.getStore();
    }
}

