// @flow
import config from "./config";

export default function init(providedOptions: {
    beforeRequest?: Function,
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
    config.initialize(providedOptions);
}
