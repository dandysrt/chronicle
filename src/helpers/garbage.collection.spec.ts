import GarbageCollection from './garbage.collection';
describe("GarbageCollection", function () {

    afterEach(function () {
        GarbageCollection.registryMap = new Map<string, FinalizationRegistry<any>>([["$DEFAULT_KEY$", new FinalizationRegistry(() => {})]]);
    });

    it("always has a default protocol", function () {
        // arrange
        // act
        // assert
        expect(GarbageCollection.registryMap.has("$DEFAULT_KEY$")).toBe(true);
    });

    it("allows the registration of multiple protocols", function () {
        // arrange
        // act
        GarbageCollection.protocol("testA", () => {});
        GarbageCollection.protocol("testB", () => {});

        // assert
        expect(GarbageCollection.registryMap.has("$DEFAULT_KEY$")).toBe(true);
        expect(GarbageCollection.registryMap.has("testA")).toBe(true);
        expect(GarbageCollection.registryMap.has("testB")).toBe(true);
    });

    it("registers a garbage collection hint with a valid protocolId", function () {
        // arrange
        const testTarget = {test: {a: "b"}};
        GarbageCollection.protocol("test", (heldValue) => {
            delete testTarget[heldValue];
        });

        // act
        GarbageCollection.hint(testTarget, "test", "test");

        // assert
        expect(GarbageCollection.registryMap.has("test")).toBe(true);
    });

    it("throws an error for hint registration attempts with invalid protocolId", function () {
        // arrange
        // act
        // assert
        expect(() => GarbageCollection.hint({}, "test", "test")).toThrow("No such registry with key 'test'");
    });
});
