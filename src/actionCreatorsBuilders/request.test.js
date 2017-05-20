import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import nock from "nock";
import axios from "axios";
import httpAdapter from "axios/lib/adapters/http";
import { isFSA } from "flux-standard-action";
import request from "./request";
import init from "../core/init";
import { areActionsInOrder } from "../../tools/testUtils";

describe("request", () => {
    const middlewares = [thunk];
    const store = configureMockStore(middlewares)({});
    const baseType = "my/action";
    const successSuffix = "/done";
    const failSuffix = "/failed";
    const startSuffix = "/started";
    const startType = `${baseType}${startSuffix}`;
    const successType = `${baseType}${successSuffix}`;
    const failType = `${baseType}${failSuffix}`;
    const host = "http://localhost";
    const suffixes = {
        start: startSuffix,
        success: successSuffix,
        error: failSuffix
    };

    axios.defaults.host = host;
    axios.defaults.adapter = httpAdapter;

    beforeEach(() => {
        store.clearActions();
        init({
            suffixes
        });
    });

    afterEach(() => {
        nock.cleanAll();
    });

    test("calls start action and success action", () => {
        nock(host)
            .get("/test")
            .reply(200);

        const actionCreator = () => request({
            baseType,
            url: "/test",
            baseURL: host
        });

        return store
            .dispatch(actionCreator())
            .then(() => {
                const actions = store.getActions();

                expect(actions.find(action => action.type === startType)).not.toBe(undefined);
                expect(actions.find(action => action.type === successType)).not.toBe(undefined);
                expect(actions.find(action => action.type === failType)).toBe(undefined);
            });
    });

    test("calls start action and fail action", () => {
        nock(host)
            .get("/test")
            .reply(404);

        const actionCreator = () => request({
            baseType,
            url: "/test",
            baseURL: host
        });

        return store
            .dispatch(actionCreator())
            .then(() => {
                const actions = store.getActions();
                const failAction = actions.find(action => action.type === failType);

                expect(actions.find(action => action.type === startType)).not.toBe(undefined);
                expect(actions.find(action => action.type === successType)).toBe(undefined);
                expect(isFSA(failAction)).toBeTruthy();
            });
    });

    test("chains multiple actions if they succeed", () => {
        nock(host)
            .get("/test1")
            .reply(200);

        nock(host)
            .get("/test2")
            .reply(200);

        const actionCreator = () => request({
            baseType,
            url: "/test1",
            baseURL: host
        });

        const nextActionCreator = () => request({
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
                    startType,
                    successType,
                    `${baseType}/next${startSuffix}`,
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

        const actionCreator = () => request({
            baseType,
            url: "/test1",
            baseURL: host,
            promisifyError: true
        });

        const nextActionCreator = () => request({
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
                    startType,
                    failType,
                    `${baseType}/next${startSuffix}`,
                    `${baseType}/next${successSuffix}`
                ])).toBeTruthy();
            });
    });
    test("handles status code response of succeeded request", () => {
        nock(host)
            .get("/test")
            .reply(200);

        const actionCreator = () => request({
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
                    startType,
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

        const actionCreator = () => request({
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
                    startType,
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

        const actionCreator = () => request({
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
                    startType,
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

        const actionCreator = () => request({
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
                    startType,
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

        const actionCreator = () => request({
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
                    startType,
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

    test("transform data of succeeded request", () => {
        nock(host)
            .get("/test")
            .reply(200, { a: 1 });

        const actionCreator = () => request({
            baseType,
            url: "/test",
            baseURL: host,
            transformData: data => data.a
        });

        return store
            .dispatch(actionCreator())
            .then(() => {
                const actions = store.getActions();
                const successAction = actions.find(action => action.type === successType);

                expect(areActionsInOrder(actions, [
                    startType,
                    successType
                ])).toBeTruthy();

                expect(successAction.payload.status).toBe(200);
                expect(successAction.payload.data).toEqual(1);
            });
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
            },
            suffixes
        });

        nock(host,
            {
                reqheaders: {
                    "custom-header": header
                }
            })
            .get("/test")
            .reply(200);

        const actionCreator = () => request({
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
                    startType,
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
            },
            suffixes
        });

        nock(host)
            .get("/test")
            .reply(200, "test", {
                "custom-header": header
            });

        const actionCreator = () => request({
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
                    startType,
                    successType
                ])).toBeTruthy();

                expect(args[0].headers["custom-header"]).toBe(header);
                expect(typeof args[1]).toBe("function");
                expect(typeof args[2]).toBe("function");
            });
    });

    test("should apply 'onSuccess' hook with access to the response, dispatch and getState", () => {
        const noop = jest.fn();
        const expectedParam = "test";

        init({
            onSuccess: (response, dispatch, getState) => {
                const transformedResponse = {
                    ...response,
                    data: {
                        ...response.data,
                        test: expectedParam
                    }
                };
                noop(transformedResponse, dispatch, getState);
                return transformedResponse;
            },
            suffixes
        });

        nock(host)
            .get("/test")
            .reply(200, {
                a: 1
            });

        const actionCreator = () => request({
            baseType,
            url: "/test",
            baseURL: host
        });

        return store
            .dispatch(actionCreator())
            .then(() => {
                const actions = store.getActions();
                const args = noop.mock.calls[0];
                const successAction = actions.find(action => action.type === successType);

                expect(areActionsInOrder(actions, [
                    startType,
                    successType
                ])).toBeTruthy();

                expect(successAction.payload.data.test).toBe(expectedParam);

                expect(typeof args[0]).toBe("object");
                expect(typeof args[1]).toBe("function");
                expect(typeof args[2]).toBe("function");
            });
    });

    test("should apply 'onError' hook with access to the response, dispatch and getState", () => {
        const noop = jest.fn();

        init({
            onError: (error, dispatch, getState) => {
                const transformedError = error;
                transformedError.meta = {
                    inTest: true
                };
                noop(transformedError, dispatch, getState);
                return transformedError;
            },
            suffixes
        });

        nock(host)
            .get("/test")
            .reply(400, {
                a: 1
            });

        const actionCreator = () => request({
            baseType,
            url: "/test",
            baseURL: host
        });

        return store
            .dispatch(actionCreator())
            .then(() => {
                const actions = store.getActions();
                const args = noop.mock.calls[0];
                const failAction = actions.find(action => action.type === failType);

                expect(areActionsInOrder(actions, [
                    startType,
                    failType
                ])).toBeTruthy();

                expect(failAction.payload.meta.inTest).toBeTruthy();

                expect(typeof args[0]).toBe("object");
                expect(typeof args[1]).toBe("function");
                expect(typeof args[2]).toBe("function");
            });
    });

    test("should take response from latest request from multiple requests", (done) => {
        init({
            suffixes
        });

        nock(host)
            .get("/test")
            .reply(200, {
                a: 1
            });

        nock(host)
            .get("/test")
            .delay(200) // will return as last response, but should be ignored
            .reply(200, {
                a: 2
            });

        nock(host)
            .get("/test")
            .delay(50)
            .reply(200, {
                a: 3
            });

        const actionCreator = () => request({
            baseType,
            url: "/test",
            baseURL: host,
            takeLatest: true
        });

        store.dispatch(actionCreator());
        store.dispatch(actionCreator());
        store.dispatch(actionCreator());

        setTimeout(() => {
            const actions = store.getActions();
            const lastSuccessAction = actions.filter(action => action.type === successType).pop();

            expect(areActionsInOrder(actions, [
                startType,
                successType
            ])).toBeTruthy();

            expect(lastSuccessAction.payload.data.a).toBe(3);
            done();
        }, 500);
    });
});
