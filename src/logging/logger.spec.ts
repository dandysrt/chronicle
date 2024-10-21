import JsonFormatter from "../formatting/json.formatter";
import ConsoleProxy from "../proxy/console.proxy";
import Logger from "./logger";
import AbstractProxy from '../models/abstract.proxy';
import { ILoggerProxy } from "../models/proxy";
import BufferedConsoleProxy from "../proxy/console.proxy.buffered";
import { FormattingOptions, IFormatter } from "../models/formatter";
import { AbstractFormatter } from '../models/abstract.formatter';

describe("Logger", function () {
    beforeAll(function () {
        jest.spyOn(console, "info");
    });

    afterEach(jest.clearAllMocks);

    it("allows specification of log-level functions", function () {
        // arrange
        // act
        const sut = new Logger(["info", "error", "warn"]);

        // assert
        expect(sut.info).toBeDefined();
        expect(sut.error).toBeDefined();
        expect(sut.warn).toBeDefined();
        expect(sut.trace).not.toBeDefined();
    });

    it("allows variable number of arguments", function () {
        // arrange
        const sut = new Logger(["info"]);

        // act
        sut.info("a", "b", "c");

        // assert
        expect(console.info).toHaveBeenCalledWith(
            expect.stringMatching(/[0-9]{4}(\-[0-9]{2}){2}T([0-9]{2}\:){2}[0-9]{2}\.[0-9]{3}Z/), "a", "b", "c"
        );
    });

    it("allows specification of a sut proxy", function () {
        // arrange
        const sut = new Logger(["info"], {proxy: ConsoleProxy});

        // act
        sut.info("a", "b", "c");

        // assert
        expect(console.info).toHaveBeenCalledWith(
            expect.stringMatching(/[0-9]{4}(\-[0-9]{2}){2}T([0-9]{2}\:){2}[0-9]{2}\.[0-9]{3}Z/), "a", "b", "c"
        );
    });

    it("allows specification of a log formatter", function () {
        // arrange
        const sut = new Logger(["info"], {formatter: JsonFormatter});

        // act
        sut.info("a", "b", {c: "c"});

        // assert
        expect(console.info).toHaveBeenCalledWith(
            expect.stringMatching(/{"message"\:"a b"\,"\@timestamp"\:"[0-9]{4}(\-[0-9]{2}){2}T([0-9]{2}\:){2}[0-9]{2}\.[0-9]{3}Z"\,"c":"c"}/)
        );
    });

    it("throws an error when formatter does not have an equivalent level", function () {
        // arrange
        // act
        // assert
        expect(() => new Logger(["info"], {formatter: InflexibleFormatter as any}))
            .toThrow("InflexibleFormatter has no level info");
    });
3
    it("throws an error when proxy does not have an equivalent level", function () {
        // arrange
        // act
        // assert
        expect(() => new Logger(["info"], {proxy: InflexibleProxy as any}))
            .toThrow("InflexibleProxy has no level info");
    });

    describe("emit", function () {
        it("does nothing if proxy does not have an 'emit' function", async function () {
            // arrange
            const sut = new Logger(["info"], {proxy: NoOpProxy as any});

            // act
            sut.info("test");
            await sut.emit();

            // assert
            expect(console.info).not.toHaveBeenCalled();
        });

        it("emits aggregated logs in one go", async function () {
            // arrange
            const sut = new Logger(["info"], {proxy: BufferedConsoleProxy});
            for (const log in ["a", "b", "c"]) {
                sut.info(log);
            }

            // act
            await sut.emit();
            
            // assert
            expect(console.info).toHaveBeenCalledTimes(3);
        });
    });

    describe("flush", function () {
        it("does nothing if proxy does not have a 'flush' function", async function () {
            // arrange
            const sut = new Logger(["info"], {proxy: NoOpProxy as any});

            // act
            // assert
            await expect(sut.flush()).resolves.not.toThrow();
        });

        it("clears the log buffer", async function () {
            // arrange
            const sut = new Logger(["info"], {proxy: BufferedConsoleProxy});

            // act
            sut.info("a");
            await sut.flush();
            await sut.emit();

            // assert
            expect(console.info).not.toHaveBeenCalled();
        });
    });
});

class NoOpProxy extends AbstractProxy implements ILoggerProxy {
    _log(level: string) {
        return (...args: any[]) => {}
    }
}

class InflexibleProxy implements ILoggerProxy{
    constructor(logLevels: string[]){}
}

class InflexibleFormatter implements IFormatter {
    formatter: any;
    errorConfig: any;
    formattingOptions: any;
    useKeys: any;

    constructor(logLevels: string[]){}

    format(...args: any[]) {}
}
