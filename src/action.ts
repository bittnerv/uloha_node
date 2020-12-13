import {AppAction} from './common/app-interfaces';

export type Result = string | number | boolean | void;
export type Action = AppAction<Result>;
