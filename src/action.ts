import {AppAction} from './common/app-interfaces';

export type Action = AppAction<Result>;
export type Result = string | number | boolean | void;
