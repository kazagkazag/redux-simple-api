import { init } from "redux-simple-api";

init({
    suffixes: {
        start: "/start",
        success: "/success",
        error: "/error"
    },
    errorTransformation: error => error.response.data.reasons,
    beforeRequest: (requestConfig, dispatch, getState) => {
        const reqConfig = {
            ...requestConfig
        };
        reqConfig.headers = reqConfig.headers || {};
        reqConfig.headers["SESSION-TOKEN"] = getState().user.token;

        return reqConfig;
    },
    onResponse: (response, dispatch) => {
        dispatch({
            type: "user/setToken",
            payload: {
                token: response.headers["SESSION-TOKEN"]
            }
        });

        return response;
    }
});