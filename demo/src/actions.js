import {buildSyncActionCreator, request} from "redux-simple-api";
import * as types from "./types";
import * as urls from "./urls";

/*
    3. Actions.

    Types of the actions are defined in types.js, nothing special here.

    We have two kinds of actions here.

    1. Regular (sync) action - clearUserPosts - which is responsible
    for clearing list of the post. More about that in reducers.js.

    2. Async/request actions: getUserData, getPostsForUser and logoutUser
    created by "request" utility. Every action must have baseType, which is
    used to construct final type (final type = baseType + suffix). 
    You can pass data, params or headers here as well. Moreover you can
    transform response from the server (so using some kind of schema is
    possible). If errors are promisified, you have to catch them, otherwise they
    will be catched by the engine, but you will not have possibility to
    perform any operation in case of error.

    And `initializeDashboard` action - this is "combined" action. As you can see
    because errors are promisified, they will bubble up and you can catch them
    and logout user (because initialization of the user dasboard failed).

    Go to the reducers.js to see how actions are handled.
*/

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

export const clearUserPosts = buildSyncActionCreator(types.clearPosts);

export const initializeDashboard = userId => dispatch =>
    dispatch(getUserData())
        .then(() => dispatch(getPostsForUser(userId)))
        .catch(() => dispatch(logoutUser(userId)));