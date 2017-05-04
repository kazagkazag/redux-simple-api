// @flow
let config = {};

function initialize(options: Object = {}): void {
    config = { ...options };
}

function get(): Object {
    return { ...config };
}

export default {
    initialize,
    get
};
