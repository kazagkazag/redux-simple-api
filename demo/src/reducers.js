import { combineReducers } from "redux";
import { buildReducers } from "redux-simple-api";
import * as types from "./types";

const user = buildReducers({
    baseType: types.userData
});

const posts = buildReducers({
    baseType: types.allPosts,
    clearDataType: types.clearPosts
});

export default combineReducers({
    user,
    posts
});
