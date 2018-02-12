# Demo application

We will create simple application, that displays list of user's posts.
There are few requirements:

1. Application must retrieve session token from response and pass that token to next request.
2. Application must logout user if something bad happened.
3. Application should provide way to clear list of posts from UI.

Let's start!

## index.jsx

We should create our entrypoint. Keep it simple:

```jsx
import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";

import "./api"; // import redux-simple-api initiazation file before importing store!
import configureStore from "./store";
import App from "./App";

ReactDOM.render(
    <Provider store={configureStore()}>
        <App />
    </Provider>,
    document.getElementById("root")
);
```

## App.jsx

Create simple list of posts:

```jsx
import React, { Component } from "react";
import { PropTypes } from "prop-types";
import { connect } from "react-redux";
import { compose } from "redux";

import { initializeDashboard, clearUserPosts } from "./actions";

class App extends Component {
    componentDidMount() {
        // initialize dashboard for user with ID 1
        this.props.initializeDashboard(1);
    }

    render() {
        return this.renderLoader()
            || this.renderApp();
    }

    renderLoader() {
        // if request is pending, render loader
        return this.props.loading ? <p>Loading...</p> : null;
    }

    renderApp() {
        const {
            user,
            posts
        } = this.props;

        return user && posts ? (
            <main>
                <header>
                    <h1>User {user.name} (as {user.role})</h1>
                </header>
                <ul>
                    {posts.map(post => {
                        return (
                            <li key={post.id}>
                                {post.title}
                            </li>
                        );
                    })}
                </ul>
                <button onClick={this.props.clearUserPosts}>
                    Clear posts
                </button>
            </main>
        ) : <p>No posts to display</p>;
    }
}

App.propTypes = {
    initializeDashboard: PropTypes.func,
    user: PropTypes.object,
    posts: PropTypes.array,
    loading: PropTypes.bool
};

function mapDispatchToProps(dispatch) {
    return {
        initializeDashboard: compose(dispatch, initializeDashboard),
        clearUserPosts: compose(dispatch, clearUserPosts)
    };
}

function mapStateToProps(state) {
    return {
        user: state.user.data,
        posts: state.posts.data,
        loading: state.posts.pending || state.user.pending
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(App);
```

## api.js

Ok, but for now our app won't work. Let's initialize api:

```js
import { init } from "redux-simple-api";
import { setToken } from "./actions";

init({
    // important: set suffixes!
    suffixes: {
        start: "/start",
        success: "/success",
        error: "/error"
    },
    // our backend returns errors wrapped in 'reasons' array
    // so extract that array from http response (it's axios construct)
    errorTransformation: error => error.response.data.reasons,
    // before every request we have to get actual token from store
    // and append it to custom header
    beforeRequest: (requestConfig, dispatch, getState) => {
        const reqConfig = {
            ...requestConfig
        };
        reqConfig.headers = reqConfig.headers || {};
        reqConfig.headers["session-token"] = getState().security.token;

        return reqConfig;
    },
    // on response we must set new token from response headers
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
```

### redux.js

`redux-simple-api` initialized, now we should use `rsa` to create actions and reducers.
For simplicity we will keep those in one file (not recommended in real apps!).

```js
import { combineReducers } from "redux";
import {buildSyncActionCreator, request, buildReducers} from "redux-simple-api";
import * as urls from "./urls"; // imagined file with map of endpoint's urls

// 1. types
export const userData = "user/data";
export const userLogout = "user/logout";
export const setToken = "security/setToken";
export const allPosts = "posts/all";
export const clearPosts = "posts/clear";

// 2. action creators for requests

const getUserData = userId => request({
    baseType: userData,
    url: `urls.userData/${userId}`,
    promisifyError: true // important, otherwise error will be swallowed and you won't be able to catch!
});

const logoutUser = userId => request({
    baseType: userLogout,
    url: urls.userLogout,
    method: "post",
    data: { userId }
});

const getPostsForUser = userId => request({
    baseType: allPosts,
    url: `${urls.allPosts}/user/${userId}`,
    promisifyError: true,
    transformData: data => data.posts
});

// 3. two main actions:
// a) simple synchronous action to clear user's posts
export const clearUserPosts = buildSyncActionCreator(clearPosts);

// b) action to fetch user data, and then get user's posts
// or if something failed - logout user
// You can see how simple is chaining actions to create real-life
// business flow
export const initializeDashboard = userId => dispatch =>
    dispatch(getUserData(userId))
        .then(() => dispatch(getPostsForUser(userId)))
        .catch(() => dispatch(logoutUser(userId)));

// 4. reducer
const user = buildReducers({
    baseType: userData
});

const posts = buildReducers({
    baseType: allPosts,
    resetType: clearPosts // note, that action with type 'clearPosts' will clear reducer state!
});

const token = (state = "", action) => {
    // regular token reducer for custom action dispatched from init()
}

export const rootReducer = combineReducers({
    user,
    posts,
    security: combineReducers({
        token
    })
});
```

### store.js

Last thing, store configuration, nothing fancy here. **Just remember - you have to
initialize api first (see `index.js`). Otherwise app will crash, because in that
file below you are requireing reducers, and they are created by `rsa`, so they
have to know at that point what configuration is provided for `rsa`.**

```js
import { createStore, applyMiddleware, compose } from "redux";
import { createLogger } from "redux-logger";
import thunkMiddleware from "redux-thunk";
import { rootReducer } from "./redux";

const loggerMiddleware = createLogger();

export default function configureStore(initialState) {
    const store = createStore(
        rootReducer,
        initialState,
        compose(
            applyMiddleware(
                thunkMiddleware,
                loggerMiddleware
            )
        )
    );
    return store;
}

```