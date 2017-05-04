// @flow
import config from "./config";

export default function init(providedOptions: Object = {}): void {
    const defaults = {
        beforeRequest: request => request,
        afterResponse: response => response,
        afterFailedRequest: response => response,
        afterSucceededRequest: response => response,
        suffixes: {
            start: "",
            success: "",
            error: ""
        }
    };
    const options = {
        beforeRequest: providedOptions.beforeRequest || defaults.beforeRequest,
        afterResponse: providedOptions.afterResponse || defaults.afterResponse,
        afterFailedRequest: providedOptions.afterFailedRequest || defaults.afterFailedRequest,
        afterSucceededRequest: providedOptions.afterSucceededRequest
            || defaults.afterSucceededRequest,
        suffixes: {
            ...defaults.suffixes,
            ...providedOptions.suffixes
        }
    };

    config.initialize(options);
}
