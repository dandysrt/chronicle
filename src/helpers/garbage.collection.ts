export default class GarbageCollection {
    private static defaultKey = "$DEFAULT_KEY$";
    static registryMap = new Map<string, FinalizationRegistry<any>>([[this.defaultKey, new FinalizationRegistry(() => {})]]);

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
