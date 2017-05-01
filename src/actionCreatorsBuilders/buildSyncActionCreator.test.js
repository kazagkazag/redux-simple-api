import { isFSA } from "flux-standard-action";
import buildSyncActionCreator from "./buildSyncActionCreator";

test("should create synchronous action creator that creates FSA action", () => {
    const type = "my/type";
    const expectedAction = {
        type,
        payload: {
            fieldA: "property A",
            fieldB: "property B"
        }
    };
    const actionCreator = buildSyncActionCreator(type, "fieldA", "fieldB");
    const action = actionCreator(expectedAction.payload.fieldA, expectedAction.payload.fieldB);
    const conformsFSA = isFSA(action);

    expect(typeof actionCreator).toBe("function");
    expect(action).toEqual(expectedAction);
    expect(conformsFSA).toBeTruthy();
});
