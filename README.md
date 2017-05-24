# Redux Simple Api

Redux Simple Api (**RSA**) is a library that helps handling requests
with redux. It is common problem for many developers - a lot of code
required to handle asynchronous actions. You can mitigate it using
`redux-thunk` and `redux-simple-api`.

## API

### init(options: object)
Main function of the RSA. Call this before initialization of the store. Remember, that your
reducers are created while store initialization, so they have to have access to the
configuration object. Best practise is to create file in which `init()` is called and
importing that file before importing store in your app. See demo for example.

Example:

```js
// apiInitialization.js

import { init } from "redux-simple-api";

init({
    // configuration
});

// index.js

import "./apiInitialization"; // initialization of RSA fired..
import { store } from "./configureStore" // now reducers have access to the RSA config
```

#### suffixes: { start: string, success: string, error: string }
Required. Strings that are attached to the three main actions dispatched during the request.
They have to be unique, otherwise reducers can handle your actions properly.

```js
init({
    suffixes: {
        start: "started",
        error: "failed",
        success: "done"
    }
});
// now if you fire action with base type `users/all`
// RSA will dispatch `users/all/started` and `users/all/done` if
// everything was ok, or `user/all/failed` if request failed
```

#### beforeRequest (requestConfig: object, dispatch: Function, getState: function) : requestConfig
Called before request is made. You have access to the entire request configuration, so you can use
this hook to apply some default configuration or dispatch another action.

```js
init({
    beforeRequest: function(requestConfig, dispatch, getState) {
        const newConfig = {
            ...requestConfig, // get existing config...
            headers: { // override headers of the request
                token: getState().auth.token // set up token using redux store
            }
        };

        return newConfig;
    }
});
```

#### onError (error: object, dispatch: Function, getState: function) : error
Called when error came from the server. You have access to the provided error and
you can modify it there or call some additional action. You have to return new error from that function.

```js
init({
    onError: function(error, dispatch) {
        // dispatch action increasing counter of failed
        // requests in the application
        dispatch({
            type: "stats/requests/failed/push",
            payload: error
        });

        return error;
    }
});
```

#### onSuccess (response: object, dispatch: Function, getState: function) : response
Called after succeeded request. In that hook you have access to the response object, and you can
use it to call any other action or modify response data etc.

```js
init({
    onSuccess: function(response, dispatch) {
        // get new session token from the response
        // and write it to the store
        dispatch({
            type: "user/setToken",
            payload: {
                token: response.headers["SESSION-TOKEN"]
            }
        });

        return response;
    }
});
```

#### errorTransformation (error: object) : object
Called in every reducer handling errors. You can use that to apply some global transformations for
errors dispatched from the actions before they are save in the store.

```js
init({
    // get `reasons` property from the JSON representation
    // of the error provided by your backend service
    errorTransformation: error => error.response.data.reasons
});
```

#### dataTransformation (data: object) : object
Called in every reducer handling succeeded request. You can use that to apply some global transformations for
payload data dispatched from the actions before they are save in the store.

```js
init({
    // get `message` property from JSON with data
    // returned from the backend
    errorTransformation: data => data.message
});
```

### buildSyncActionCreator(type: string, ...argNames: Array<any>): Function

Creates action creator function - factory for actions with specified type.

```js
// definition
const addUser = buildSyncActionCreator("my/action/type", "age", "name");

// usage
const action = addUser(22, "Bob");

// action:
{
    type: "my/action/type",
    payload: {
        age: 22,
        name: "Bob"
    }
}
```

### request (options: Object): Function

Creates request which is composed by three main actions:
* start action
* success action
* error action
`start action` is dispatched before making xhr call, `success action` is dispatched
when response come back with status code 2xx, `error action` is dispatched if request failed
because of any reason.

Options:

#### baseType: string

Type of the base action. `baseType` and `suffixes` (see below) will be used to construct
types of all three main actions.

#### startSuffix: string --> delete

Suffix of the start action. It will be added to the `baseType`. Overrides initial configuration of the RSA.

#### successSuffix: string --> delete

Suffix of the success action. It will be added to the `baseType`. Overrides initial configuration of the RSA.

#### failedSuffix: string --> delete

Suffix of the error action. It will be added to the `baseType`. Overrides initial configuration of the RSA.

```js
const addUser = () => request({
    baseType: "users/add",
    startSuffix: "/started",
    successSuffix: "/done",
    failedSuffix: "/failed",
    // ... other options
});

// dispatching above `addUser` will result with dispatching following actions in case of success:
// `users/add/started` > `users/add/done`
// or following actions in case of failure:
// `users/add/started` > `users/add/failed`
```

#### promisifyError: boolean

If `true`, then errors will handled by `error action` **and** bubble up from the `request()`.
So you have to use `.catch()` to catch them. If `false` errors will be handled by `error action`
and they will **not** bubble up from the `request()`, so you have no possibility to chain next
action in case of failure of the first action.

```js
const addUser = () => request({
    promisifyError: true,
    // ... other options
});

const notifyAboutFailedRegistration = () => request({
    // ... options
});

const addNewuser = () => dispatch =>
    dispatch(addUser())
        .catch(() => dispatch(notifyAboutFailedRegistration());

// now you can dispatch `addNewUser` and if adding new user fail,
// system will be notified about failed registration
```

#### takeLatest: boolean

If `true` only the response from the latest dispatched request will be handled. If `false`
the latest response will override previously stored data even if that response was received not
for the last request.

#### transformData: (data: any): any

Function used to transform `data` property of the response.

```js
const getUsers = () => request({
    transformData: data => data.users
});

// if backend will response with following object:

{
    users: [...] //list of users
    meta: {...} // some metadata, timestamp etc
}

// only the `users` property will be passed to the success action and stored in `payload.data`
// of success action
```

### buildReducers(options: Object): Object

Creates root reducer for your request, composed of four reducers:
* `pending` - holds boolean - `true` if request is pending
* `done` - holds boolean - `true` if last request succeeded
* `error` - holds object - error object or result of error transformation for last request
* `data` - holds object - data or result of data transformation for last request

Options:

#### baseType: string

Base type of the action which reducer should handle. Types of the start, success or error action
will be computed based on `baseType` and suffixes provided in `init()`.

#### customReducers: { pending: Function, done: Function, error: Function, data: Function }

Object with optional custom reducers. You can provide any of those reducer, if you want to
override default behaviour. Provided function takes one argument: `actionTypes` with properties:
`{start: string, success: string, error: string}`. Properties hold computed action types for three
main request actions. Custom reducer should return reducer function able to handle any of those actions.

```js
const addingUser = buildReducers({
    baseType: "user/add",
    customReducers: {
        error: actionTypes => {
            return (state = null, action) => {
                switch(action.type) {
                    case actionTypes.error:
                        return "Ups!";
                    case actionTypes.start:
                    case actionTypes.success:
                        return null;
                    default:
                        return state;
                }
            }
        }
    }
});

// now if request fail, you will always have "Ups!" string in `error` reducer in `addingUser`
// store property
```

Let's see an example, simple dashboard with user posts for next great
blogging platform. We have few requirements:

* our actions have following form of the type property: `my/action`,
we wan't to add suffixes to all request actions: `/start`, `/done` and `/failed`
to simply identify in `redux dev tools` which action was dispatched
* we have to attach to every request custom header `SESSION-TOKEN` with
token saved previously in our redux store, so we need access to store
* after every response, we have to get new `SESSION-TOKEN` from response headers
and save it in the redux store
* every failed request could have some data with details from the backend in JSON
format, so we have to save those details
* after App mount, we would like to fetch user data, users posts and if any of those request
failed, we have to logout user
* moreover, we wan't to clear list of posts before App unmount

1. Store configuration:
```js
import { createStore, compose, applyMiddleware } from "redux";
import thunkMiddleware from "redux-thunk";
import rootReducer from "../rootReducer";

function configureStore(initialState) {
    return createStore(
        rootReducer,
        initialState,
        compose(
            applyMiddleware(
                thunkMiddleware
            )
        )
    );
}

const store = configureStore();

export default store;
```
Nothing special so far, it is typical store configurator with redux-thunk as middleware.
Now we can initialize our app:
```js
// ...maany imports...
import {init} from "redux-simple-api"; // something new...
import store from "./store";

init({
    beforeRequest: function(requestConfig, dispatch, getState) {
          requestConfig.headers["SESSION-TOKEN"] = getState().user.token;
          return requestConfig;
    },
    onResponse: function(response, dispatch) {
        dispatch({
            type: "user/setToken",
            payload: {
                token: response.headers["SESSION-TOKEN"]
            }
        });
    },
    errorTransformation: function (payload) {
        return payload.response.data;
    },
    suffixes: {
        start: "/start",
        success: "/done",
        error: "/failed"
    }
}); // initialize library with config required for our app

// render your application
```
Ok, two new things:
* import `import {init} from "redux-simple-api";`
* `init()` - you have to call `init` before rendering entire application.
`init` takes configuration object, which is described below in API section.
For now you should know, that you can skip this argument and let
library works on defaults. But we need some configuration, so we provided:
* suffixes, now every action will have our action type composed of base action type
and suffix, depends on which state of the request it was dispatched
* few hooks:
    * `beforeRequest` - in that hook we can get current token and add it to the request
    headers
    * `onResponse` - after response we have to get new token from the response headers
    and save it in the store
    * `errorTransformation` - when errors came, that transformation will be used
     in error reducer to transform error action to the format expected in our store

Now you can write your request handlers using few RSA helpers.
We have app bootstrapped, but we need to fetch user data and
user posts.
For simplicity sake, we will keep data related to the user domain,
posts domain and dashboard domain in one file.

```js
import {request, buildActionCreator, buildReducers} from "redux-simple-api";
import {combineReducers} from "redux";
import urls from "../my/url/configuration";

// action types

const userData = "user/data";
const userLogout = "user/logout";
const allPosts = "posts/all";
const clearPosts = "posts/clear";
const dashboardInitialization = "dashboard/init";

// action creators

const getUserData = () => request({
    baseType: userData,
    url: urls.userData,
    promisifyError: true
});

const logoutUser = userId => request({
    basetType: userLogout,
    url: urls.userLogout,
    method: "post",
    data: { userId }
});

const getPostsForUser = userId => request({
    baseType: allPosts,
    url: `${urls.allPosts}/user/${userId}`,
    promisifyError: true
});

const clearUserPosts = () => buildActionCreator(clearPosts);

const initializeDashboard = userId => dispatch =>
    dispatch(getUserData())
        .then(() => dispatch(getPostsForUser(userId)))
        .catch(() => dispatch(logoutUser(userId)));

// reducers

const user = buildReducers({
    baseType: userData
});

const posts = buildReducers({
    baseType: allPosts,
    clearDataType: clearPosts
});

const rootReducer = combineReducers({
    users,
    posts
});

export {
    // all actions and rootReducer
}
```

And the last missing part, your component:

```js
// all imports...

class App extends Component {
    componentDidMount() {
        this.props.initializeDashboard();
    }
    
    componentWillUnmount() {
        this.props.clearUserPosts();
    }
    
    render() {
        const {user, posts} = this.props;
        return <Dashboard user={user} posts={posts}/>;
    }
}

function mapStateToProps(state) {
    return {
        users: state.user.data,
        posts: state.posts.data
    };
}

function mapDispatchToProps(dispatch) {
    return {
        initializeDashboard: compose(dispatch, initializeDashboard),
        clearUserPosts: compose(dispatch, clearUserPosts)
    };  
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
```

Ok, so how it is works?

1. We have set up some defaults. Thanks to them, before every request and
after every response we have access to the request/response data and to the store.
We can dispatch actions, so we are able to save/get token from the store.
2. We defined few action types - for fetching user data, posts and for clearing
all posts.
3. We created action creators for fetching user data, fetching posts, logging out
user and one combined action creator for initializing dashboard. We are able
to chain actions and catch errors, so it is very easy to implement business logic
in action creators.
4. We defined reducers to keep data about user and posts.
5. Our App component dispatched two actions: `initializeDashboard` after mount
and `clearPosts` before unmount. Thanks to that:
    * initializeDashboard will fire actions in following order:
        * `user/data/start` 
        * `user/data/done` 
        * `posts/all/start` 
        * `posts/all/done`
        
        Notice suffixes, we specified them in RSA `init()`, so every request action
        will have them now.
    * after `user/data/done` in our root reducer we will have some data:
    
    ```js
    {
        users: {
            pending: false,
            done: true,
            data: { data }, //any data returned from the backend 
            error: null
        },
        posts: {
            pending: false,
            done: false,
            data: null, 
            error: null
        }
    }
    ```

    * after `posts/all/done` our store will look like this:
     
    ```js
    {
        users: {
            pending: false,
            done: true,
            data: { data }, //any data returned from the backend 
            error: null
        },
        posts: {
            pending: false,
            done: true,
            data: { data }, //any data returned from the backend 
            error: null
        }
    }
    ```

    * or if fetching posts request will fail, we would end up with following actions chain:
        * `user/data/start` 
        * `user/data/done` 
        * `posts/all/start` 
        * `posts/all/failed`
        * `user/logout/start`
        * `user/logout/done`
        
    * before unmount App will dispatch `clearUsersPosts` action, that will clear only `data`
    part of the `posts` reducer. Result:
    

    ```js
    {
        users: {
            pending: false,
            done: true,
            data: { data }, // any data returned from the backend 
            error: null
        },
        posts: {
            pending: false,
            done: true,
            data: null, // returned initial state of the reducer
            error: null
        }
    }
    ```