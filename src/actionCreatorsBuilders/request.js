// @flow

import axios from "axios";
import shortid from "shortid";
import buildSyncActionCreator from "./buildSyncActionCreator";
import rsaConfig from "../core/config";
import queue from "../core/queue";

export default function request(requestConfig: {
    baseType: string,
    promisifyError?: boolean,
    takeLatest?: boolean,
    transformData?: Function
}): Function {
    const {
        baseType,
        startSuffix,
        successSuffix,
        errorSuffix,
        promisifyError,
        takeLatest,
        transformData,
        ...axiosConfig
    } = getOptions(requestConfig);

    const actions = getActions(baseType, {
        startSuffix,
        successSuffix,
        errorSuffix
    });

    return (dispatch: Function, getState: Function) => {
        dispatch(actions.start());

        const requestId = shortid.generate();

        if (takeLatest) {
            queue[baseType] = requestId;
        }

        const defaultErrorHandler = error => dispatch(actions.error(error));
        const defaultSuccessHandler = response =>
            dispatch(actions.success(
                transformData(response.data), response.status
            ));

        const successHandler = takeLatest
            ? getSuccessHandler(defaultSuccessHandler, requestId, baseType)
            : defaultSuccessHandler;

        const customErrorHandler = error =>
            rsaConfig.get().onError.call(null, error, dispatch, getState);

        const transformedConfig = rsaConfig.get().beforeRequest(axiosConfig, dispatch, getState);

        return axios
            .request(transformedConfig)
            .then(response => rsaConfig.get().onSuccess(response, dispatch, getState))
            .then(successHandler)
            .catch(getErrorHandler(promisifyError, defaultErrorHandler, customErrorHandler));
    };
}

function getActions(baseType: string, suffixes: Object): Object {
    const types = {
        start: `${baseType}${suffixes.startSuffix}`,
        success: `${baseType}${suffixes.successSuffix}`,
        error: `${baseType}${suffixes.errorSuffix}`
    };

    return {
        start: buildSyncActionCreator(types.start),
        success: buildSyncActionCreator(types.success, "data", "status"),
        error: error => ({
            type: types.error,
            payload: error,
            error: true
        })
    };
}

function getOptions(config: Object): Object {
    const {
        start,
        success,
        error
    } = rsaConfig.get().suffixes;

    return {
        baseType: config.baseType || "no/type",
        startSuffix: start,
        errorSuffix: error,
        successSuffix: success,
        url: config.url || "/defaultUrl",
        baseURL: getBaseURL(config.baseURL),
        method: config.method || "get",
        promisifyError: config.promisifyError,
        takeLatest: config.takeLatest || false,
        transformData: config.transformData || (data => data),
        params: config.params
    };
}

function getBaseURL(providedBaseURL: string): string {
    return providedBaseURL || getDefaultBaseURL();
}

function getDefaultBaseURL(): string {
    return process.env.NODE_ENV === "test"
        ? "http://localhost"
        : "";
}

function getErrorHandler(promisifyError: boolean,
                         defaultErrorHandler: Function,
                         customErrorHandler: Function) {
    return promisifyError
        ? function returnError(error: Object) {
            const handledError = customErrorHandler(error);
            defaultErrorHandler(handledError);
            return Promise.reject(handledError);
        }
        : function returnError(error: Object) {
            const handledError = customErrorHandler(error);
            defaultErrorHandler(handledError);
        };
}

function getSuccessHandler(defaultSuccessHandler: Function,
                           requestId: string,
                           requestBaseType: string): Function {
    return function handleLatestResponse(response) {
        return queue[requestBaseType] === requestId
            ? defaultSuccessHandler(response)
            : function noop() {
            };
    };
}
