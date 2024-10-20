import DefaultFormatter from "../formatting/default.formatter";
import DelimitedFormatter from "../formatting/delimited.formatter";
import JsonFormatter from "../formatting/json.formatter";
import LogEnrichment from "./log.enrichment";

import {} from "jest";

describe("LogEnrichment", function () {
    it.each([
        ["default", new DefaultFormatter([])],
        ["delimited", new DelimitedFormatter([])],
        ["json", new JsonFormatter([])]
    ])("does not modify input with the % formatter and no formatter options", function (_, formatter) {
        // arrange
        const fields = ["a", "b", {c: "d"}];
        const sut = new LogEnrichment("test", formatter);
        const expected = ["a", "b", {c: "d"}];

        // act
        sut.addFields(...fields.entries());
        const result = sut.getFields();

        // assert
        expect(result).toMatchObject(expected);
    });

    it.each([
        ["does not", "default", new DefaultFormatter([]), [{a: "b"}, {c: "d"}]],
        ["does", "delimited", new DelimitedFormatter([]), [["a", "b"],["c", "d"]]],
        ["does not", "json", new JsonFormatter([]), [{a: "b"}, {c: "d"}]]
    ])("%s appropriately attributes keys to output with %s formatter useKeys enabled", function (_, _type, formatter, expected) {
        // arrange
        formatter.useKeys = true;
        const sut = new LogEnrichment("test", formatter);
        const fields = [{a: "b"}, {c: "d"}];

        // act
        sut.addFields(...fields);
        const result = sut.getFields();

        // assert
        expect(result).toMatchObject(expected);
    });

    it("allows default specification of attributes", function () {
        // arrange
        const fields = [{a: "b"}, {c: "d"}];

        // act
        const sut = LogEnrichment.withDefaultFields(
            "test",
            new DefaultFormatter([]),
            ...fields
        );
        
        const enrichmentFields = sut.getFields();

        // assert
        expect(enrichmentFields).toMatchObject(
            [{"a":"b"}, {"c":"d"}]
        );
    });
});
