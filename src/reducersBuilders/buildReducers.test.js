import buildReducers from "./buildReducers";
import buildSyncActionCreator from "../actionCreatorsBuilders/buildSyncActionCreator";
import init from "../core/init";

describe("buildReducers", () => {
    let reducer;

    const successSuffix = "/done";
    const errorSuffix = "/failed";
    const baseType = "my/action";
    const successType = `${baseType}${successSuffix}`;
    const errorType = `${baseType}${errorSuffix}`;

    const getStartAction = buildSyncActionCreator(baseType);
    const getSuccessAction = buildSyncActionCreator(successType, "data");
    const getErrorAction = payload => ({
        type: errorType,
        payload,
        error: true
    });

    beforeEach(() => {
        init({
            suffixes: {
                start: "",
                success: successSuffix,
                error: errorSuffix
            }
        });

        reducer = buildReducers({
            baseType
        });
    });

    test("should handle unrelated action", () => {
        const expected = {
            pending: false,
            done: false,
            data: null,
            error: null
        };

        const received = reducer(undefined, { type: "unrelated" });

        expect(received).toEqual(expected);
    });

    test("should handle starting request action", () => {
        const expected = {
            pending: true,
            done: false,
            data: null,
            error: null
        };

        const received = reducer(undefined, getStartAction());

        expect(received).toEqual(expected);
    });

    test("should handle action after succeeded request", () => {
        const responseData = { a: 1 };
        const expected = {
            pending: false,
            done: true,
            data: responseData,
            error: null
        };

        const received = reducer(undefined, getSuccessAction(responseData));

        expect(received).toEqual(expected);
    });

    test("should handle action after failed request", () => {
        const networkError = new Error("Ups, 404.");
        networkError.data = {
            causedBy: "test property",
            code: "my.error.code"
        };
        const expected = {
            pending: false,
            done: false,
            data: null,
            error: networkError
        };

        const received = reducer(undefined, getErrorAction(networkError));

        expect(received).toEqual(expected);
    });

    test("should handle action after failed request and apply error transformation", () => {
        init({
            suffixes: {
                start: "",
                success: successSuffix,
                error: errorSuffix
            },
            errorTransformation: error => error.data
        });
        const networkError = new Error("Ups, 404.");
        networkError.data = {
            causedBy: "test property",
            code: "my.error.code"
        };
        const expected = {
            pending: false,
            done: false,
            data: null,
            error: networkError.data
        };

        const received = reducer(undefined, getErrorAction(networkError));

        expect(received).toEqual(expected);
    });

    test("should handle action after succeeded request and apply data transformation", () => {
        init({
            suffixes: {
                start: "",
                success: successSuffix,
                error: errorSuffix
            },
            dataTransformation: data => data.message
        });
        const responseData = { message: 1 };
        const expected = {
            pending: false,
            done: true,
            data: responseData.message,
            error: null
        };

        const received = reducer(undefined, getSuccessAction(responseData));

        expect(received).toEqual(expected);
    });
});

