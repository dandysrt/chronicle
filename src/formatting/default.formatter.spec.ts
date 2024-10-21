import DefaultFormatter from "./default.formatter";

describe("DefaultFormatter", function () {
    it("formats input", function () {
        // arrange
        const sut = new DefaultFormatter(["info"]);
        const error = new Error("test");
        const args = [error];

        // act
        const formatted = sut.info(...args);

        // assert
        expect(formatted).toMatchObject([/[0-9]{4}(\-[0-9]{2}){2}T([0-9]{2}\:){2}[0-9]{2}\.[0-9]{3}Z/, "Error test"]);
    });

    it("allows specification of log-level functions", function () {
        // arrange
        const undefinedSut = new DefaultFormatter([]);
        const definedSut = new DefaultFormatter(["info"]);

        // act
        // assert
        expect(undefinedSut.info).toBeUndefined();
        expect(definedSut.info).toBeInstanceOf(Function);
    });

    it("allows variable number of arguments", function () {
        // arrange
        const sut = new DefaultFormatter(["info"]);
        const error = new Error("test");
        const args = [1, {a: "b"}, error];

        // act
        const formatted = sut.info(...args);

        // assert
        expect(formatted).toMatchObject([/[0-9]{4}(\-[0-9]{2}){2}T([0-9]{2}\:){2}[0-9]{2}\.[0-9]{3}Z/, 1, '{"a":"b"}', "Error test"]);
    });

    it("allows specification of error format", function () {
        // arrange
        const sut = new DefaultFormatter(["info"]);
        const unspecified = sut.info(new Error("test-error"));

        // act
        sut.errorConfig.stackTrace = true;
        sut.errorConfig.delim = ">";
        const formatted = sut.info(new TypeError("stack-traced error", {cause: "a mistake"}));

        // assert
        expect(unspecified).toMatchObject([/[0-9]{4}(\-[0-9]{2}){2}T([0-9]{2}\:){2}[0-9]{2}\.[0-9]{3}Z/, "Error test-error"]);
        expect(formatted).toMatchObject([/[0-9]{4}(\-[0-9]{2}){2}T([0-9]{2}\:){2}[0-9]{2}\.[0-9]{3}Z/, /TypeError: stack-traced error(\n.*)+\>a mistake/]);
    });

    it("format returns an array of formatted inputs", function () {
// arrange
        const sut = new DefaultFormatter([]);
        const error = new Error("test");
        const args = ["a", "b", {c: "d"}, error];

        // act
        const formatted = sut.format(...args);

        // assert
        expect(formatted).toMatchObject([
            /[0-9]{4}(\-[0-9]{2}){2}T([0-9]{2}\:){2}[0-9]{2}\.[0-9]{3}Z/,
            "a",
            "b",
            '{"c":"d"}',
            "Error test"
        ]);
    });
});
