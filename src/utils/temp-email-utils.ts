import crypto from 'crypto';
import 'dotenv/config';

export const generateTempEmailAddress = (): string => {
    const domain = process.env.TEMP_EMAIL_DOMAIN;
    if (!domain) {
        throw new Error('TEMP_EMAIL_DOMAIN env variable is not set');
    }
    const random = crypto.randomBytes(10).toString('hex');
    return `${random}@${domain}`;
};