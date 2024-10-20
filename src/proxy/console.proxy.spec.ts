import ConsoleProxy from "./console.proxy";

describe("ConsoleProxy", function () {
    beforeAll(function () {
        jest.spyOn(console, "info");
        console.info = jest.fn(console.info);
    });

    afterEach(jest.clearAllMocks);

    it("allows the specification of logLevel functions", function () {
        // arrange
        // act
        const logProxy = new ConsoleProxy(["info", "error", "warn"]);

        // assert
        expect(logProxy.error).toBeDefined();
        expect(logProxy.info).toBeDefined();
        expect(logProxy.warn).toBeDefined();

        expect(logProxy.trace).not.toBeDefined();
    });

    it("allows variable arguments", function () {
        // arrange
        const logProxy = new ConsoleProxy(["info"]);

        // act
        logProxy.info("a", "b", "c");

        // assert
        expect(console.info).toHaveBeenCalledWith("a", "b", "c");
    });

    it("outputs logs to console", function () {
        // arrange
        const logProxy = new ConsoleProxy(["info"]);

        // act
        logProxy.info("test log");

        // assert
        expect(console.info).toHaveBeenCalledWith("test log");
    });
});
