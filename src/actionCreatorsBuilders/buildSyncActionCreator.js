// @flow

// it is simple function taken from: http://redux.js.org/docs/recipes/ReducingBoilerplate.html
export default function buildSyncActionCreator(type: string, ...argNames: Array<any>): Function {
    return (...args: Array<any>): Object => {
        const action = { type };

        argNames.forEach((arg, index) => {
            action[argNames[index]] = args[index];
        });

        return action;
    };
}
