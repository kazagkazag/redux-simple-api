// @flow
import config from "./config";

export default function init(providedOptions: {
    beforeRequest?: Function,
    onResponse?: Function,
    onError?: Function,
    onSuccess?: Function,
    errorTransformation?: Function,
    dataTransformation?: Function,
    suffixes?: {
        start?: string,
        success?: string,
        error?: string
    }
} = {}): void {
    const defaults = {
        beforeRequest: request => request,
        onResponse: response => response,
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
    const options = {
        beforeRequest: providedOptions.beforeRequest || defaults.beforeRequest,
        onResponse: providedOptions.onResponse || defaults.onResponse,
        onError: providedOptions.onError || defaults.onError,
        onSuccess: providedOptions.onSuccess
            || defaults.onSuccess,
        errorTransformation: providedOptions.errorTransformation
            || defaults.errorTransformation,
        dataTransformation: providedOptions.dataTransformation
            || defaults.dataTransformation,
        suffixes: {
            ...defaults.suffixes,
            ...providedOptions.suffixes
        }
    };

    config.initialize(options);
}
