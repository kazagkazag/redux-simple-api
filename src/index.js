import request from "./actionCreatorsBuilders/request";
import buildSyncActionCreator from "./actionCreatorsBuilders/buildSyncActionCreator";
import init from "./core/init";
import buildReducers from "./reducersBuilders/buildReducers";

export default {
    buildSyncActionCreator,
    request,
    init,
    buildReducers
};
