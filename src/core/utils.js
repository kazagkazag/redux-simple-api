// @flow
function createInitialRemoteResource() {
    return {
        done: false,
        pending: false,
        error: null,
        data: null
    };
}

export default {
    createInitialRemoteResource
};
