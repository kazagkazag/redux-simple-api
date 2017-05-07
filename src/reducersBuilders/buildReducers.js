// @flow
import { combineReducers } from "redux";
import rsaConfig from "../core/config";

export default function buildReducers(options: Object): Object {
    const {
        baseType
    } = options;

    const actionTypes = getActionTypes(baseType);

    return combineReducers({
        pending: getPendingReducer(actionTypes),
        done: getDoneReducer(actionTypes),
        error: getErrorReducer(actionTypes),
        data: getDataReducer(actionTypes)
    });
}

function getActionTypes(baseType: string): Object {
    const defaultSuffixes = rsaConfig.get().suffixes;

    return {
        start: `${baseType}${defaultSuffixes.start}`,
        success: `${baseType}${defaultSuffixes.success}`,
        error: `${baseType}${defaultSuffixes.error}`
    };
}

function getPendingReducer(actionTypes) {
    return (state = false, action) => {
        switch (action.type) {
            case actionTypes.start:
                return true;
            case actionTypes.success:
            case actionTypes.error:
                return false;
            default:
                return state;
        }
    };
}

function getDoneReducer(actionTypes) {
    return (state = false, action) => {
        switch (action.type) {
            case actionTypes.success:
                return true;
            case actionTypes.start:
            case actionTypes.error:
                return false;
            default:
                return state;
        }
    };
}

function getErrorReducer(actionTypes) {
    return (state = null, action) => {
        const errorTransformation = rsaConfig.get().errorTransformation;

        switch (action.type) {
            case actionTypes.error:
                return errorTransformation(action.payload) || null;
            case actionTypes.start:
            case actionTypes.success:
                return null;
            default:
                return state;
        }
    };
}

function getDataReducer(actionTypes) {
    return (state = null, action) => {
        switch (action.type) {
            case actionTypes.success:
                return action.payload.data || null;
            case actionTypes.start:
            case actionTypes.error:
                return null;
            default:
                return state;
        }
    };
}
