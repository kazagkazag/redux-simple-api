import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import nock from "nock";
import axios from "axios";
import httpAdapter from "axios/lib/adapters/http";
import buildRequestActionCreator from "./buildRequestActionCreator";

describe("buildRequestActionCreator", () => {
    const middlewares = [thunk];
    const store = configureMockStore(middlewares)({});
    const baseType = "my/action";
    const successSuffix = "/done";
    const failSuffix = "/failed";
    const successType = `${baseType}${successSuffix}`;
    const failType = `${baseType}${failSuffix}`;
    const host = "http://localhost";

    axios.defaults.host = host;
    axios.defaults.adapter = httpAdapter;

    beforeEach(() => {
        store.clearActions();
    });

    afterEach(() => {
        nock.cleanAll();
    });

    test("calls start action and success action", () => {
        nock(host)
            .get("/test")
            .reply(200);

        const actionCreator = () => buildRequestActionCreator({
            baseType,
            url: "/test",
            baseURL: host
        });

        return store
            .dispatch(actionCreator())
            .then(() => {
                const actions = store.getActions();

                expect(actions.find(action => action.type === baseType)).not.toBe(undefined);
                expect(actions.find(action => action.type === successType)).not.toBe(undefined);
                expect(actions.find(action => action.type === failType)).toBe(undefined);
            });
    });

    test("calls start action and fail action", () => {
        nock(host)
            .get("/test")
            .reply(404);

        const actionCreator = () => buildRequestActionCreator({
            baseType,
            url: "/test",
            baseURL: host
        });

        return store
            .dispatch(actionCreator())
            .then(() => {
                const actions = store.getActions();

                expect(actions.find(action => action.type === baseType)).not.toBe(undefined);
                expect(actions.find(action => action.type === successType)).toBe(undefined);
                expect(actions.find(action => action.type === failType)).not.toBe(undefined);
            });
    });
    test("handles status code response", () => {
    });
    test("handles text response", () => {
    });
    test("handles json response", () => {
    });
    test("handles custom data transformation", () => {
    });
    test("handles request transformation", () => {
    });
    test("takes latest request", () => {
    });
    test("debounces requests for specified time", () => {
    });
    test("throttles requests for specified time", () => {
    });
    test("chains multiple actions if they succeed", () => {
    });
    test("chains multiple actions and catch error if one of them failed", () => {
    });
});
