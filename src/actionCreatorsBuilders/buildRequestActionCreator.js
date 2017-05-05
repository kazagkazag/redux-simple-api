// @flow

import axios from "axios";
import buildSyncActionCreator from "./buildSyncActionCreator";
import rsaConfig from "../core/config";

export default function buildRequestActionCreator(requestConfig: Object): Function {
    const {
        baseType,
        startSuffix,
        successSuffix,
        failSuffix,
        promisifyError,
        ...axiosConfig
    } = getOptions(requestConfig);

    const actions = getActions(baseType, {
        startSuffix,
        successSuffix,
        failSuffix
    });

    return (dispatch: Function, getState: Function) => {
        dispatch(actions.start());

        const defaultErrorHandler = error => dispatch(actions.fail(error));
        const transformedConfig = rsaConfig.get().beforeRequest(axiosConfig, dispatch, getState);

        return axios
            .request(transformedConfig)
            .then(response => rsaConfig.get().onResponse(response, dispatch, getState))
            .then(response => dispatch(actions.success(response.data, response.status)))
            .catch(getErrorHandler(promisifyError, defaultErrorHandler));
    };
}

function getActions(baseType: string, suffixes: Object): Object {
    const types = {
        start: `${baseType}${suffixes.startSuffix}`,
        success: `${baseType}${suffixes.successSuffix}`,
        fail: `${baseType}${suffixes.failSuffix}`
    };

    return {
        start: buildSyncActionCreator(types.start),
        success: buildSyncActionCreator(types.success, "data", "status"),
        fail: error => ({
            type: types.fail,
            payload: error,
            error: true
        })
    };
}

function getOptions(config: Object): Object {
    return {
        baseType: config.baseType || "no/type",
        startSuffix: config.startSuffix || "",
        failSuffix: config.failSuffix || "/failed",
        successSuffix: config.successSuffix || "/done",
        url: config.url || "/defaultUrl",
        baseURL: getBaseURL(config.baseURL),
        method: config.method || "get",
        promisifyError: config.promisifyError
    };
}

function getBaseURL(providedBaseURL) {
    return providedBaseURL || getDefaultBaseURL();
}

function getDefaultBaseURL() {
    return process.env.NODE_ENV === "test"
        ? "http://localhost"
        : "http://baseUrlNotProvided";
}

function getErrorHandler(promisifyError, defaultErrorHandler) {
    return promisifyError
        ? function returnError(error) {
            defaultErrorHandler(error);
            return Promise.reject(error);
        }
        : defaultErrorHandler;
}
