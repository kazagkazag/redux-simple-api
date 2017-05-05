import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import nock from "nock";
import axios from "axios";
import httpAdapter from "axios/lib/adapters/http";
import buildRequestActionCreator from "./buildRequestActionCreator";
import init from "../core/init";
import { areActionsInOrder } from "../../tools/testUtils";

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
        init();
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

    test("chains multiple actions if they succeed", () => {
        nock(host)
            .get("/test1")
            .reply(200);

        nock(host)
            .get("/test2")
            .reply(200);

        const actionCreator = () => buildRequestActionCreator({
            baseType,
            url: "/test1",
            baseURL: host
        });

        const nextActionCreator = () => buildRequestActionCreator({
            baseType: `${baseType}/next`,
            url: "/test2",
            baseURL: host
        });

        const combinedActions = () => dispatch =>
            dispatch(actionCreator())
                .then(() => dispatch(nextActionCreator()));

        return store
            .dispatch(combinedActions())
            .then(() => {
                const actions = store.getActions();

                expect(areActionsInOrder(actions, [
                    baseType,
                    successType,
                    `${baseType}/next`,
                    `${baseType}/next${successSuffix}`
                ])).toBeTruthy();
            });
    });

    test("chains multiple actions and catch error if one of them failed", () => {
        nock(host)
            .get("/test1")
            .reply(400);

        nock(host)
            .get("/test2")
            .reply(200);

        const actionCreator = () => buildRequestActionCreator({
            baseType,
            url: "/test1",
            baseURL: host,
            promisifyError: true
        });

        const nextActionCreator = () => buildRequestActionCreator({
            baseType: `${baseType}/next`,
            url: "/test2",
            baseURL: host
        });

        const combinedActions = () => dispatch =>
            dispatch(actionCreator())
                .catch(() => dispatch(nextActionCreator()));

        return store
            .dispatch(combinedActions())
            .then(() => {
                const actions = store.getActions();

                expect(areActionsInOrder(actions, [
                    baseType,
                    failType,
                    `${baseType}/next`,
                    `${baseType}/next${successSuffix}`
                ])).toBeTruthy();
            });
    });
    test("handles status code response of succeeded request", () => {
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
                const successAction = actions.find(action => action.type === successType);

                expect(areActionsInOrder(actions, [
                    baseType,
                    successType
                ])).toBeTruthy();

                expect(successAction.payload.status).toBe(200);
                expect(successAction.payload.data).toBe("");
            });
    });

    test("handles status code response of failed request", () => {
        nock(host)
            .get("/test")
            .reply(400);

        const actionCreator = () => buildRequestActionCreator({
            baseType,
            url: "/test",
            baseURL: host
        });

        return store
            .dispatch(actionCreator())
            .then(() => {
                const actions = store.getActions();
                const failAction = actions.find(action => action.type === failType);

                expect(areActionsInOrder(actions, [
                    baseType,
                    failType
                ])).toBeTruthy();

                expect(failAction.payload.message).toContain("400");
                expect(failAction.error).toBe(true);
            });
    });

    test("handles text response of succeeded request", () => {
        nock(host)
            .get("/test")
            .reply(200, "test response");

        const actionCreator = () => buildRequestActionCreator({
            baseType,
            url: "/test",
            baseURL: host
        });

        return store
            .dispatch(actionCreator())
            .then(() => {
                const actions = store.getActions();
                const successAction = actions.find(action => action.type === successType);

                expect(areActionsInOrder(actions, [
                    baseType,
                    successType
                ])).toBeTruthy();

                expect(successAction.payload.status).toBe(200);
                expect(successAction.payload.data).toBe("test response");
            });
    });

    test("handles json response of succeeded request", () => {
        nock(host)
            .get("/test")
            .reply(200, { a: 1 });

        const actionCreator = () => buildRequestActionCreator({
            baseType,
            url: "/test",
            baseURL: host
        });

        return store
            .dispatch(actionCreator())
            .then(() => {
                const actions = store.getActions();
                const successAction = actions.find(action => action.type === successType);

                expect(areActionsInOrder(actions, [
                    baseType,
                    successType
                ])).toBeTruthy();

                expect(successAction.payload.status).toBe(200);
                expect(successAction.payload.data).toEqual({ a: 1 });
            });
    });

    test("handles json response of failed request", () => {
        nock(host)
            .get("/test")
            .reply(400, { a: 1 });

        const actionCreator = () => buildRequestActionCreator({
            baseType,
            url: "/test",
            baseURL: host
        });

        return store
            .dispatch(actionCreator())
            .then(() => {
                const actions = store.getActions();
                const failAction = actions.find(action => action.type === failType);

                expect(areActionsInOrder(actions, [
                    baseType,
                    failType
                ])).toBeTruthy();

                expect(failAction.payload.message).toContain("400");
                expect(failAction.payload.response.data).toEqual({ a: 1 });
                expect(failAction.error).toBe(true);
            });
    });

    test("takes latest request", () => {
    });
    test("debounces requests for specified time", () => {
    });
    test("throttles requests for specified time", () => {
    });

    test("should apply 'before request' hook with access to the request config, dispatch and getState", () => {
        const noop = jest.fn();
        const header = "test header";

        init({
            beforeRequest: (reqConfig, dispatch, getState) => {
                const newConfig = { ...reqConfig };
                newConfig.headers = {
                    "custom-header": header
                };
                noop(newConfig, dispatch, getState);
                return newConfig;
            }
        });

        nock(host,
            {
                reqheaders: {
                    "custom-header": header
                }
            })
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
                const args = noop.mock.calls[0];

                expect(areActionsInOrder(actions, [
                    baseType,
                    successType
                ])).toBeTruthy();

                expect(args[0].headers["custom-header"]).toBe(header);
                expect(typeof args[1]).toBe("function");
                expect(typeof args[2]).toBe("function");
            });
    });

    test("should apply 'onResponse' hook with access to the response, dispatch and getState", () => {
        const noop = jest.fn();
        const header = "test header";

        init({
            onResponse: (response, dispatch, getState) => {
                noop(response, dispatch, getState);
                return response;
            }
        });

        nock(host)
            .get("/test")
            .reply(200, "test", {
                "custom-header": header
            });

        const actionCreator = () => buildRequestActionCreator({
            baseType,
            url: "/test",
            baseURL: host
        });

        return store
            .dispatch(actionCreator())
            .then(() => {
                const actions = store.getActions();
                const args = noop.mock.calls[0];

                expect(areActionsInOrder(actions, [
                    baseType,
                    successType
                ])).toBeTruthy();

                expect(args[0].headers["custom-header"]).toBe(header);
                expect(typeof args[1]).toBe("function");
                expect(typeof args[2]).toBe("function");
            });
    });
});
