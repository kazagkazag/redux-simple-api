import { init } from "redux-simple-api";
import { setToken } from "./types";

/*
    2. Call init() with some basic configuration:

    a) suffixes - every request will dispatch actions with type constructed of 
    type specified during the action initializatin and those suffixes.

    b) errorTransformation - errors provided by our server have JSON form with
    reasons array (list of strings with error messages), so we wan't to extract
    those messages (it is global configuration)

    c) beforeRequest - our server requires session token to be set in headers, 
    otherwise it will reject requests. This behaves as interceptor, it is called
    before every request and transforms request (in this screnario - headers).

    d) onSuccess - response interceptor. Our session token is disposable, 
    you can use it once and new token will be provided in the response from the server. 
    We wan't to extract that new token and save it in the store, so before next 
    request we can set that token in the header (see above).

    Ok. Now go to the actions.js.
*/
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
        reqConfig.headers["session-token"] = getState().security.token;

        return reqConfig;
    },
    onSuccess: (response, dispatch) => {
        dispatch({
            type: setToken,
            payload: {
                token: response.headers["session-token"]
            }
        });

        return response;
    }
});