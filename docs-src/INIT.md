# 1. init(options: object)
Main function of the RSA. Call this before initialization of the store. Remember, that your
reducers are created while store initialization, so they have to have access to the
configuration object. **Best practise is to create file in which `init()` is called and
importing that file before importing store in your app.** See demo for example.

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

## Options: 

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
