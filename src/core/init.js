// @flow
import config from "./config";

export default function init(providedOptions: Object = {}): void {
    const defaults = {
        beforeRequest: request => request,
        onResponse: response => response,
        onError: response => response,
        onSuccess: response => response,
        suffixes: {
            start: "",
            success: "",
            error: ""
        }
    };
    const options = {
        beforeRequest: providedOptions.beforeRequest || defaults.beforeRequest,
        onResponse: providedOptions.onResponse || defaults.onResponse,
        onError: providedOptions.onError || defaults.onError,
        onSuccess: providedOptions.onSuccess
            || defaults.onSuccess,
        suffixes: {
            ...defaults.suffixes,
            ...providedOptions.suffixes
        }
    };

    config.initialize(options);
}
