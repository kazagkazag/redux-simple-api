function removeActionIfTypeMatches(action, actionTypes) {
    if (typeof action !== "function" && action.type === actionTypes[0]) {
        actionTypes.shift();
    }
}

export function areActionsInOrder(actions, actionTypesInExpectedOrder) {
    if (!actions || !actionTypesInExpectedOrder || !actions.length || !actionTypesInExpectedOrder.length) {
        return false;
    }

    const remainingActionTypes = [...actionTypesInExpectedOrder];

    actions.forEach(action => removeActionIfTypeMatches(action, remainingActionTypes));

    return !remainingActionTypes.length;
}
