import { combineReducers } from "redux";
import { buildReducers } from "redux-simple-api";
import * as types from "./types";

/*
    4. Reducers.

    Reducers configuration is pretty easy. For most time you wan't only
    to specify baseType on which reducer should react. Result of the reducers
    is the same for every "branch". 
    
    For example: you will end up with four reducers for "user" branch: 
    pending (boolean), done (boolean), data (null or data from the response), 
    error (null or error object).

    Moreover, if clearPosts action will be dispatched, state of "posts" branch
    will be reset to default state (pending: false, done: false, data: null, error: null).

    Token reducer is plain old redux reducer to handle token changing (see api.js and
    request/response interceptors).

    Now open App.js and see how data flows.
*/

const user = buildReducers({
    baseType: types.userData
});

const posts = buildReducers({
    baseType: types.allPosts,
    resetType: types.clearPosts
});

const token = (state = "", action) => {
    switch(action.type) {
        case types.setToken:
            return action.payload.token || "";
        default:
            return state;
    }
}

export default combineReducers({
    user,
    posts,
    security: combineReducers({
        token
    })
});
