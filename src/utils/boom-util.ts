import Boom from '@hapi/boom';
import { Key } from '../enums/key.js';

export const unauthorizedWithKey = (message: string, key: Key): Boom.Boom => {
    const err = Boom.unauthorized(message);
    (err.data as string) = key;
    return err;
};
