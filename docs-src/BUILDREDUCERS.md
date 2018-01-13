# 4. buildReducers(options: Object): Object

Creates root reducer for your request, composed of four reducers:
* `pending` - holds boolean - `true` if request is pending
* `done` - holds boolean - `true` if last request succeeded
* `error` - holds object - error object or result of error transformation for last request
* `data` - holds object - data or result of data transformation for last request

## Options:

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