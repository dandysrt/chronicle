import EnrichmentEngine from "../enrichment/enrichment.engine";

export default class GarbageCollection {
    private static defaultKey = "$DEFAULT_KEY$";

    /* istanbul ignore next */
    private static defaultCallback = (heldValue: any) => EnrichmentEngine.enrichmentMap.delete(heldValue);
    public static readonly registryMap = new Map<string, FinalizationRegistry<any>>([[this.defaultKey, new FinalizationRegistry(this.defaultCallback)]]);

    static set defaultProtocol(callback: (heldValue: any) => void) {
        this.protocol(this.defaultKey, callback);
    }

    static protocol = (protocolId: string, callback: (heldValue: any) => void) => {
        this.registryMap.set(protocolId, new FinalizationRegistry(callback));
    }

    static hint = (target: any, heldValue: any, protocolId?: string) => {            
        const registry = this.registryMap.get(protocolId || this.defaultKey);
        if (!!registry) {
            return registry.register(target, heldValue, target);
        }

        throw new Error(`No such registry with key '${protocolId}'`);
    }
}
