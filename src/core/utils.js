// @flow
export default function createInitialRemoteResource() {
    return {
        done: false,
        pending: false,
        error: null,
        data: null
    };
}
