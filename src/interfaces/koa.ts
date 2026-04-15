import type { Middleware } from '@koa/router';
import type { IState } from './state.js';

export type ISMiddleware = Middleware<IState>;
