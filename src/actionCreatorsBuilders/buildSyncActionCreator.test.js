import buildSyncActionCreator from "./buildSyncActionCreator";

test("should create synchronous action creator that creates action", () => {
    const type = "my/type";
    const expectedAction = {
        type,
        fieldA: "property A",
        fieldB: "property B"
    };
    const actionCreator = buildSyncActionCreator(type, "fieldA", "fieldB");
    const action = actionCreator(expectedAction.fieldA, expectedAction.fieldB);

    expect(typeof actionCreator).toBe("function");
    expect(action).toEqual(expectedAction);
});
