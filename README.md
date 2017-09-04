# Redux Simple Api

Redux Simple Api (**RSA**) is a library that helps handling requests
with redux. It is common problem for many developers - a lot of code
required to handle asynchronous actions. You can mitigate it using
`redux-thunk` and `redux-simple-api`.

## API

1. [init](#1-initoptions-object) - initializes library
2. [buildSyncActionCreator](#2-buildsyncactioncreatortype-string-argnames-array-function) - creates regular action creator
3. [request](#3-request-options-object-function) - creates action creator that handles API calls
4. [buildReducers](#4-buildreducersoptions-object-object) - creates reducers that handles results of `request`s

### 1. init(options: object)
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

### 2. buildSyncActionCreator(type: string, ...argNames: Array<any>): Function

Creates action creator function - factory for actions with specified type.

```js
// definition
const addUser = buildSyncActionCreator("my/action/type", "age", "name");

// usage
const action = addUser(22, "Bob");
dispatch(action);
// or
dispatch(addUser(22, "Bob"));

// action:
{
    type: "my/action/type",
    payload: {
        age: 22,
        name: "Bob"
    }
}
```

### 3. request (options: Object): Function

Creates request which is composed by three main actions:
* start action
* success action
* error action

`start action` is dispatched before making xhr call, `success action` is dispatched
when response come back with status code 2xx, `error action` is dispatched if request failed
because of any reason.

It uses axios internally, so you can pass a lot of axios options, like `params`, `data`,
`method`.

Options:

#### baseType: string

Type of the base action. `baseType` and `suffixes` (see below) will be used to construct
types of all three main actions.

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

### 4. buildReducers(options: Object): Object

Creates root reducer for your request, composed of four reducers:
* `pending` - holds boolean - `true` if request is pending
* `done` - holds boolean - `true` if last request succeeded
* `error` - holds object - error object or result of error transformation for last request
* `data` - holds object - data or result of data transformation for last request

Options:

#### baseType: string

Base type of the action which reducer should handle. Types of the start, success or error action
will be computed based on `baseType` and suffixes provided in `init()`.

#### resetType: string

Type of the action that causes reset of the reducers state, if built in reducers are used.
If you wan't to reset custom reducers, you should handle `actionType.reset` in custom reducer
(see below).

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

## Example

For example application built with RSA please visit `/demo` directory, and start from `index.js` file.
Usage of the RSA is explained in comments. **In progress for now!**