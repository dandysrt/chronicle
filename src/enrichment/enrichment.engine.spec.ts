import EnrichmentEngine from "./enrichment.engine";
import LogEnrichment from './log.enrichment';

describe("EnrichmentEngine", function () {
    afterEach(function () {
        for (const key of EnrichmentEngine.enrichmentMap.keys()) {
            EnrichmentEngine.enrichmentMap.delete(key);
        }
    });

    it("maintains LogEnrichment within an async context", function () {
        // arrange
        let testEnrichment: LogEnrichment;
        const testFunc = () => {
            testEnrichment = EnrichmentEngine.enrichmentFields({a: "a", b: "b", c: "c"});
        }

        // act
        EnrichmentEngine.runInContext("test", testFunc);
        
        // assert
        expect(testEnrichment.getFields()).toMatchObject(
            [{"a":"a","b":"b","c":"c"}]
        );
    });

    it("maintains a collection of LogEnrichment objects", function () {
        // arrange
        const key1 = EnrichmentEngine.enrichmentFields(["a", "b"]).key;
        const key2 = EnrichmentEngine.enrichmentFields(["c", "d"]).key;

        // act
        const enrichmentEngineSize = EnrichmentEngine.enrichmentMap.size;
        const result1 = EnrichmentEngine.enrichmentMap.get(key1).getFields();
        const result2 = EnrichmentEngine.enrichmentMap.get(key2).getFields();

        // assert
        expect(enrichmentEngineSize).toBe(2);
        expect(result1).toMatchObject(["b"]);
        expect(result2).toMatchObject(["d"]);
    });
});
