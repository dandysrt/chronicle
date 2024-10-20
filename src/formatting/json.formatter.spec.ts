import JsonFormatter from "./json.formatter";

describe("JsonFormatter", function () {
    it("appends object arguments to the log output", function () {
        // arrange
        const sut = new JsonFormatter(["info"]);

        // act
        const formatted = sut.info("main message", {a: "a"}, {b: "b"}, {c: "c"});

        // assert
        expect(JSON.parse(formatted[0])).toMatchObject({
            message: "main message",
            a: "a",
            b: "b",
            c: "c",
            "@timestamp": /[0-9]{4}(\-[0-9]{2}){2}T([0-9]{2}\:){2}[0-9]{2}\.[0-9]{3}Z/
        });
    });

    it("appends non-object arguments to the PRIMARY message key", function () {
        // arrange
        const sut = new JsonFormatter(["info"]);

        // act
        const formatted = sut.info("just a string", "and another string", "and one more for measure");

        // assert
        expect(JSON.parse(formatted[0])).toMatchObject({
            message: "just a string and another string and one more for measure",
            "@timestamp": /[0-9]{4}(\-[0-9]{2}){2}T([0-9]{2}\:){2}[0-9]{2}\.[0-9]{3}Z/
        });
    });

    it("allows specification of the PRIMARY message key", function () {
        // arrange
        const sut = new JsonFormatter(["info"]);
        sut.messageKey = "output";

        // act
        const formatted = sut.info("main message");

        // assert
        expect(JSON.parse(formatted[0])).toMatchObject({
            output: "main message",
            "@timestamp": /[0-9]{4}(\-[0-9]{2}){2}T([0-9]{2}\:){2}[0-9]{2}\.[0-9]{3}Z/
        });
    });

    it("handles cycles in object arguments", function () {
        // arrange
        const cyclicObject = {a: "b"};
        cyclicObject["c"] = cyclicObject;
        const sut = new JsonFormatter(["info"]);

        // act
        const formatted = sut.info(cyclicObject);

        // assert
        expect(JSON.parse(formatted[0])).toMatchObject({
            a: "b",
            "@timestamp": /[0-9]{4}(\-[0-9]{2}){2}T([0-9]{2}\:){2}[0-9]{2}\.[0-9]{3}Z/
        });
    });

    it("allows specification of log-level functions", function () {
        // arrange
        const sut = new JsonFormatter(["info"]);

        // act
        const formatted = sut.info("main message", {a: "a"}, {b: "b"}, {c: "c"});

        // assert
        expect(JSON.parse(formatted[0])).toMatchObject({
            message: "main message",
            a: "a",
            b: "b",
            c: "c",
            "@timestamp": /[0-9]{4}(\-[0-9]{2}){2}T([0-9]{2}\:){2}[0-9]{2}\.[0-9]{3}Z/
        });
    });

    it("allows variable number of arguments", function () {
        // arrange
        const sut = new JsonFormatter(["info"]);

        // act
        const formatted = sut.info(1, 2, 3, 4);

        // assert
        expect(JSON.parse(formatted[0])).toMatchObject({
            message: "1 2 3 4",
            "@timestamp": /[0-9]{4}(\-[0-9]{2}){2}T([0-9]{2}\:){2}[0-9]{2}\.[0-9]{3}Z/
        });
    });

    it("allows specification of error format", function () {
        // arrange
        const sut = new JsonFormatter(["error"]);
        const unspecified = sut.error(new Error("test-error"));

        // act
        sut.errorConfig.stackTrace = true;
        sut.errorConfig.delim = ">";
        const formatted = sut.error(new TypeError("stack-traced error", {cause: "a mistake"}));

        // assert
        expect(JSON.parse(unspecified[0])).toMatchObject({
            message: "test-error",
            stack: /Error: test-error error(\n.*)/,
            "@timestamp": /[0-9]{4}(\-[0-9]{2}){2}T([0-9]{2}\:){2}[0-9]{2}\.[0-9]{3}Z/
        });
        expect(JSON.parse(formatted[0])).toMatchObject({
            cause: "a mistake",
            message: "stack-traced error",
            stack: /TypeError: stack-traced error(\n.*)/,
            "@timestamp": /[0-9]{4}(\-[0-9]{2}){2}T([0-9]{2}\:){2}[0-9]{2}\.[0-9]{3}Z/
        });
    });
});
