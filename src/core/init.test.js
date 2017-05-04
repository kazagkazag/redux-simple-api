import init from "./init";
import config from "./config";

test("should set suffixes in the config", () => {
    const suffixes = {
        start: "start",
        success: "success",
        error: "error"
    };

    init({
        suffixes
    });

    expect(config.get().suffixes).toEqual(suffixes);
});

test("should set before request hook in the config", () => {
    const beforeRequest = function spy() {
    };

    init({
        beforeRequest
    });

    expect(config.get().beforeRequest).toEqual(beforeRequest);
});

test("should set after response hook in the config", () => {
    const afterResponse = function spy() {
    };

    init({
        afterResponse
    });

    expect(config.get().afterResponse).toEqual(afterResponse);
});

test("should set 'after failed request' hook in the config", () => {
    const afterFailedRequest = function spy() {
    };

    init({
        afterFailedRequest
    });

    expect(config.get().afterFailedRequest).toEqual(afterFailedRequest);
});

test("should set 'after succeeded request' hook in the config", () => {
    const afterSucceededRequest = function spy() {
    };

    init({
        afterSucceededRequest
    });

    expect(config.get().afterSucceededRequest).toEqual(afterSucceededRequest);
});
