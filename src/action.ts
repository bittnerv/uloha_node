import {AppAction} from './common/app-action';

export type Action = AppAction<Result>;
export type Result = string | number | boolean | void;
