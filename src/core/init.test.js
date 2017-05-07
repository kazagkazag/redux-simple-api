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
    const onResponse = function spy() {
    };

    init({
        onResponse
    });

    expect(config.get().onResponse).toEqual(onResponse);
});

test("should set 'after failed request' hook in the config", () => {
    const onError = function spy() {
    };

    init({
        onError
    });

    expect(config.get().onError).toEqual(onError);
});

test("should set 'after succeeded request' hook in the config", () => {
    const onSuccess = function spy() {
    };

    init({
        onSuccess
    });

    expect(config.get().onSuccess).toEqual(onSuccess);
});

test("should set error transformation in the config", () => {
    const errorTransformation = function spy() {
    };

    init({
        errorTransformation
    });

    expect(config.get().errorTransformation).toEqual(errorTransformation);
});
