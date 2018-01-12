// @flow
let config = {};

const defaults = {
    beforeRequest: request => request,
    onError: response => response,
    onSuccess: response => response,
    errorTransformation: error => error,
    dataTransformation: error => error,
    suffixes: {
        start: "_start",
        success: "_done",
        error: "_failed"
    }
};

function initialize(options: Object = {}): void {
    config = { ...config, ...options };
}

function get(): Object {
    return {
        beforeRequest: config.beforeRequest || defaults.beforeRequest,
        onError: config.onError || defaults.onError,
        onSuccess: config.onSuccess || defaults.onSuccess,
        errorTransformation: config.errorTransformation || defaults.errorTransformation,
        dataTransformation: config.dataTransformation || defaults.dataTransformation,
        suffixes: {
            ...defaults.suffixes,
            ...config.suffixes
        }
    };
}

export default {
    initialize,
    get
};
