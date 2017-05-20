# Redux Simple Api

Redux Simple Api (**RSA**) is a library that helps handling requests
with redux. It is common problem for many developers - a lot of code
required to handle asynchronous actions. You can mitigate it using
`redux-thunk` and `redux-simple-api`.

## API

### init(options: object)

Main function of the RSA. Call this before initialization of the store. Remember, that your
reducers are created while store initialization, so they have to have access to the
configuration object. Best practise is to create file within initialization happens and directly
calling `init()` in that file. See demo for example.

#### beforeRequest (requestConfig: object, dispatch: Function, getState: function) : requestConfig
#### onResponse (response: object, dispatch: Function, getState: function) : response
Remove this!
#### onError (error: object, dispatch: Function, getState: function) : error
#### onSuccess (response: object, dispatch: Function, getState: function) : response
#### errorTransformation (error: object) : object
#### dataTransformation (data: object) : object
#### suffixes: { start: string, success: string, error: string }

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