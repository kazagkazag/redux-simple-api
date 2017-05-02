// @flow

import axios from "axios";
import buildSyncActionCreator from "./buildSyncActionCreator";

export default function buildRequestActionCreator(config: Object): Function {
    const {
        baseType,
        startSuffix,
        successSuffix,
        failSuffix,
        promisifyError,
        ...axiosConfig
    } = getOptions(config);

    const types = {
        start: `${baseType}${startSuffix}`,
        success: `${baseType}${successSuffix}`,
        fail: `${baseType}${failSuffix}`
    };

    const actions = {
        start: buildSyncActionCreator(types.start),
        success: buildSyncActionCreator(types.success, "data"),
        fail: buildSyncActionCreator(types.fail, "error")
    };

    return (dispatch: Function) => {
        dispatch(actions.start());

        const defaultErrorHandler = error => dispatch(actions.fail(error));

        return axios
            .request(axiosConfig)
            .then(response => dispatch(actions.success(response)))
            .catch(getErrorHandler(promisifyError, defaultErrorHandler));
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
