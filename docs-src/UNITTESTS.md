# Unit tests

#### Testing action creators

Unit testing synchronous action creators is pretty straightforward:

```js
// tested action creator:
const type = "my/type";
const actionCreator = buildSyncActionCreator(type, "fieldA", "fieldB");

// using jest platform:
test("should create action fir fields A and B", () => {
    const expectedAction = {
        type: "my/type",
        payload: {
            fieldA: "property A",
            fieldB: "property B"
        }
    };
    const action = actionCreator(expectedAction.payload.fieldA, expectedAction.payload.fieldB); // use it in isolation

    expect(typeof actionCreator).toBe("function");
    expect(action).toEqual(expectedAction); // inspect resulting action
});
```

#### Testing async action creators

Testing asynchronous action creators is more tricky, because they are coupled with redux and thunk.
First, you should install `redux-mock-store` to create fake stores for your tests.

Now you have two options.

1. Use real implementation of `request` function and use something like `nock` to mock
backend responses (because `request` will issue real http requests!):

```js
// tested action creator:
const actionCreator = () => request({
    baseType: "some/type",
    url: "/test",
    baseURL: host
});

// test
test("calls start action and success action", () => {
    // mock store
    const middlewares = [thunk];
    const store = configureMockStore(middlewares)({});

    // mock backend using nock package
    nock("http://localhost")
        .get("/test")
        .reply(200);

    // dispatch creator on fake store
    return store
        .dispatch(actionCreator())
        .then(() => {
            const actions = store.getActions();

            expect(); // inspect fired actions to test the logic of your action creator
        });
});
```

2. Mock entire http client (axios) by custom http client provided in `extraArgument` for `thunk` (this is preffered way):

```js
// tested action creator:
const actionCreator = () => request({
    baseType: "some/type",
    url: "/test",
    baseURL: host
});

// test
test("makes request with correct configuration", () => {
    // mock http client
    // no request will be issued!
    // remember: http client HAVE TO implement `request` method that returns a promise!
    const httpClient = {
        request: jest.fn(() => Promise.resolve(true))
    };
    // mock store with custom http client that will be used by `request` function instead of axios
    const storeWithCustomHttpClient = configureMockStore(
        [thunk.withExtraArgument({ httpClient })]
    )({});

    // dispatch action on mocked store
    return storeWithCustomHttpClient
        .dispatch(actionCreator())
        .then(() => {
            // inspect http client calls or actions (see above example for details)
            expect(httpClient.request).toHaveBeenCalledWith({
                baseURL: "http://localhost",
                data: undefined,
                headers: undefined,
                method: "get",
                params: undefined,
                url: "/test"
            });
        });
});
```