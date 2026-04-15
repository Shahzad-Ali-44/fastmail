import type { IMetaData } from './meta-data.js';

export interface IResponse<T = any> {
    metaData: Readonly<IMetaData>;
    data?: T;
}
