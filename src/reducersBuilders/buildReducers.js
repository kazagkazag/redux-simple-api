// @flow
import { combineReducers } from "redux";
import rsaConfig from "../core/config";

export default function buildReducers(options: {
    baseType: string,
    resetType: string,
    customReducers?: {
        pending?: Function,
        done?: Function,
        error?: Function,
        data?: Function
    }
}): Object {
    const {
        baseType,
        resetType,
        customReducers = {}
    } = options;

    const actionTypes = getActionTypes(baseType, resetType);

    return combineReducers({
        pending: customReducers.pending
            ? customReducers.pending(actionTypes)
            : getPendingReducer(actionTypes),
        done: customReducers.done
            ? customReducers.done(actionTypes)
            : getDoneReducer(actionTypes),
        error: customReducers.error
            ? customReducers.error(actionTypes)
            : getErrorReducer(actionTypes),
        data: customReducers.data
            ? customReducers.data(actionTypes)
            : getDataReducer(actionTypes)
    });
}

function getActionTypes(baseType: string, resetType: string): Object {
    const defaultSuffixes = rsaConfig.get().suffixes;

    return {
        start: `${baseType}${defaultSuffixes.start}`,
        success: `${baseType}${defaultSuffixes.success}`,
        error: `${baseType}${defaultSuffixes.error}`,
        reset: resetType || ""
    };
}

function getPendingReducer(actionTypes) {
    return (state = false, action) => {
        switch (action.type) {
            case actionTypes.start:
                return true;
            case actionTypes.success:
            case actionTypes.error:
            case actionTypes.reset:
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
            case actionTypes.reset:
                return false;
            default:
                return state;
        }
    };
}

function getErrorReducer(actionTypes) {
    return (state = null, action) => {
        const { errorTransformation } = rsaConfig.get();

        switch (action.type) {
            case actionTypes.error:
                return errorTransformation(action.payload) || null;
            case actionTypes.start:
            case actionTypes.success:
            case actionTypes.reset:
                return null;
            default:
                return state;
        }
    };
}

function getDataReducer(actionTypes) {
    return (state = null, action) => {
        const { dataTransformation } = rsaConfig.get();

        switch (action.type) {
            case actionTypes.success:
                return dataTransformation(action.payload.data) || null;
            case actionTypes.start:
            case actionTypes.error:
            case actionTypes.reset:
                return null;
            default:
                return state;
        }
    };
}
