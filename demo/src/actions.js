import {buildSyncActionCreator, request} from "redux-simple-api";
import * as types from "./types";
import * as urls from "./urls";

const getUserData = () => request({
    baseType: types.userData,
    url: urls.userData,
    promisifyError: true
});

const logoutUser = userId => request({
    baseType: types.userLogout,
    url: urls.userLogout,
    method: "post",
    data: { userId }
});

const getPostsForUser = userId => request({
    baseType: types.allPosts,
    url: `${urls.allPosts}/user/${userId}`,
    promisifyError: true,
    transformData: data => data.posts
});

export const clearUserPosts = () => buildSyncActionCreator(types.clearPosts);

export const initializeDashboard = userId => dispatch =>
    dispatch(getUserData())
        .then(() => dispatch(getPostsForUser(userId)))
        .catch(() => dispatch(logoutUser(userId)));