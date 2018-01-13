# 3. request (options: Object): Function

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
