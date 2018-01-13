# 2. buildSyncActionCreator(type: string, ...argNames: Array<any>): Function

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