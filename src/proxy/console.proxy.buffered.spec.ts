import BufferedConsoleProxy from "./console.proxy.buffered";

describe("BufferedConsoleProxy", function () {
    beforeAll(function () {
        jest.spyOn(console, "info");
        console.info = jest.fn(console.info);
    });

    afterEach(jest.clearAllMocks);

    it("allows the specification of log-level functions", function () {
        // arrange
        // act
        const sut = new BufferedConsoleProxy(["info", "error", "warn"]);

        // assert
        expect(sut.info).toBeDefined();
        expect(sut.error).toBeDefined();
        expect(sut.warn).toBeDefined();
        expect(sut.trace).not.toBeDefined();
    });

    it("allows variable number of arguments", function () {
        // arrange
        // act
        const sut = new BufferedConsoleProxy(["info"]);

        // assert
        sut.info("a", "b", "c");
    });

    it("only outputs logs to console when emit is called", async function () {
        // arrange
        const sut = new BufferedConsoleProxy(["info"]);

        // act
        sut.info("a", "b", "c");
        expect(console.info).not.toHaveBeenCalled();

        await sut.emit();

        // assert
        expect(console.info).toHaveBeenCalled();

    });

    it("flushes the buffer when flush is called", async function () {
        // arrange
        const sut = new BufferedConsoleProxy(["info"]);

        // act
        sut.info("a", "b", "c");
        await sut.flush();
        await sut.emit();

        // assert
        expect(sut.buffer.length).toBe(0);
        expect(console.info).not.toHaveBeenCalled();
    });
});
