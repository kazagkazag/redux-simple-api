// Type definitions for Redux Simple Api
// Project: Redux Simple Api
// Definitions by: Kamil Zagrabski

export interface BuildSyncActionCreatorOptions {
    type: string;
    argNames?: any[];
}
export function buildSyncActionCreator(buildSyncActionCreatorOptions: BuildSyncActionCreatorOptions): (...args: any[]) => object;

export interface InitOptions {
    beforeRequest?: (request: any) => any;
    onError?: (request: any) => any;
    onSuccess?: (request: any) => any;
    errorTransformation?: (request: any) => any;
    dataTransformation?: (request: any) => any;
    suffixes?: {
        start?: string,
        success?: string,
        error?: string
    }
}
export function init(initOptions: InitOptions): void;

export interface RequestOptions {
    baseType: string,
    promisifyError?: boolean,
    takeLatest?: boolean,
    transformData?: (data: any) => any
}
export function request(requestOptions: RequestOptions): (dispatch: () => void, getState: () => any) => Promise<any>;

export interface BuildReducersOptions {
    baseType: string,
    customReducers?: {
        pending?: (state: boolean, action: any) => any,
        done?: (state: boolean, action: any) => any,
        error?: (state: any, action: any) => any,
        data?: (state: any, action: any) => any
    }
}
export function buildReducers(buildReducersOptions: BuildReducersOptions): (state: any, action: any) => any;