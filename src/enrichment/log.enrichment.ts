import { EnrichmentFields } from "../models/enrichment";
import { IFormatter } from "../models/formatter";
import { randomUUID } from "node:crypto";

export default class LogEnrichment {
    private enrichmentMap = new Map();

    constructor(
        public readonly key: string|any,
        public formatter: IFormatter
    ){}

    private updateField = (name: string, value: object|string): void => {
        this.enrichmentMap.set(name, value);
    }

    static withDefaultFields = (
        key: string|any, formatter: IFormatter, ...defaultFields: any[]
    ): LogEnrichment => {
        const enrichment = new LogEnrichment(key, formatter);
        enrichment.addFields(...defaultFields);

        return enrichment;
    }

    addFields = (...fields: EnrichmentFields): void => {
        for (const field of fields) {
            if (Array.isArray(field)) {
                this.updateField(field[0], field[1]);
            } else if (this.formatter.useKeys) {
                for (const entry of Object.entries(field)) {
                    this.updateField(...entry);
                }
            }else {
                this.updateField(randomUUID(), field);
            }
        }
    }

    getFields = (): any[] => {
        return this.formatter.useKeys
            ? Array.from(this.enrichmentMap.entries())
            : Array.from(this.enrichmentMap.values());
    }
}
