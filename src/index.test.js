import * as lib from "./index";

describe("Library", () => {
    test("should export API", () => {
        expect(typeof lib.buildReducers).toBe("function")
        expect(typeof lib.buildSyncActionCreator).toBe("function")
        expect(typeof lib.init).toBe("function")
        expect(typeof lib.request).toBe("function")
        expect(typeof lib.createInitialRemoteResource).toBe("function")
    });
});
