import DelimitFormatter from "./delimited.formatter";
describe("DelimitedFormatter", function () {
    it.each([
        ["number", 1, "1"],
        ["string", "test-string", "test-string"],
        ["object", {a: "b"}, '{"a":"b"}'],
        ["array", ["a", 1],  '\\["a"\,1\\]'],
        ["error", new Error("testing"), 'Error testing']
    ])("stringifies %s arguments", function (type: string, argument: any, expected: any) {
        // arrange
        const sut = new DelimitFormatter(["info"]);

        // act
        const formatted = sut.info(type, argument);

        // assert
        expect(formatted).toMatchObject(
            [RegExp(`.* ${type} ${expected}`)]
        );
    });

    it("handles cycles in object arguments", function () {
        // arrange
        const sut = new DelimitFormatter(["info"]);
        const cyclicObject = {a: "b"};
        cyclicObject["c"] = cyclicObject;

        // act
        const formatted = sut.info(cyclicObject);

        // assert
        expect(formatted).toMatchObject([/[0-9]{4}(\-[0-9]{2}){2}T([0-9]{2}\:){2}[0-9]{2}\.[0-9]{3}Z {"a":"b"}/]);
    });

    it("allows specification of the delimiter", function () {
        // arrange
        const sut = new DelimitFormatter(["info"], "|");

        // act
        const formatted = sut.info("a", "b", "c");

        // assert
        expect(formatted).toMatchObject([/[0-9]{4}(\-[0-9]{2}){2}T([0-9]{2}\:){2}[0-9]{2}\.[0-9]{3}Z|a|b|c/]);
    });

    it("allows specification of log-level functions", function () {
        // arrange
        const logLevels = ["info"];
        const sut = new DelimitFormatter(logLevels);

        // act
        const formatted = sut.info("a");

        // assert
        expect(formatted).toMatchObject([/[0-9]{4}(\-[0-9]{2}){2}T([0-9]{2}\:){2}[0-9]{2}\.[0-9]{3}Z a/]);
    });

    it("allows variable number of arguments", function () {
        // arrange
        const sut = new DelimitFormatter(["info"]);

        // act
        const formatted = sut.info("a", "b", "c");

        // assert
        expect(formatted).toMatchObject([/[0-9]{4}(\-[0-9]{2}){2}T([0-9]{2}\:){2}[0-9]{2}\.[0-9]{3}Z a b c/]);
    });

    it("allows specification of error format", function () {
        // arrange
        const sut = new DelimitFormatter(["error"]);
        const unspecified = sut.error(new Error("test-error"));
        
        // act
        sut.errorConfig.stackTrace = true;
        sut.errorConfig.delim = ">";
        const formatted = sut.error(new TypeError("stack-traced error", {cause: "a mistake"}));

        // assert
        expect(unspecified).toMatchObject([/[0-9]{4}(\-[0-9]{2}){2}T([0-9]{2}\:){2}[0-9]{2}\.[0-9]{3}Z Error test-error/]);
        expect(formatted).toMatchObject([/[0-9]{4}(\-[0-9]{2}){2}T([0-9]{2}\:){2}[0-9]{2}\.[0-9]{3}Z TypeError: stack-traced error(\n.*)+\>a mistake/]); 
    });
});
