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

    xtest("should handle action after failed request", () => {
        const expected = {
            pending: false,
            done: false,
            data: null,
            error: null
        };

        const received = reducer(undefined, getErrorAction(new Error("Some error"), {
            data: {
                causedBy: "test property",
                code: "my.error.code"
            }
        }));

        expect(received).toEqual(expected);
    });
});

