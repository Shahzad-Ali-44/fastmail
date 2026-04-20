import { TempEmailModel } from '../models/classes/temp-email-model.js';
import { TempEmailMessageModel } from '../models/classes/temp-email-message-model.js';
import { generateTempEmailAddress } from '../utils/temp-email-utils.js';

const tempEmailModel = new TempEmailModel();
const tempEmailMessageModel = new TempEmailMessageModel();

export const getTempEmailForUser = async (userId: number): Promise<{ address: string }> => {
    const existing = await tempEmailModel.getTempEmailByUserId(userId);
    if (existing?.address) {
        return { address: existing.address };
    }

    const address = generateTempEmailAddress();
    await tempEmailModel.createTempEmailForUser({ userId, address });
    return { address };
};

export const getCurrentTempEmailForUser = async (userId: number): Promise<{ address: string }> => {
    return await getTempEmailForUser(userId);
};

export const createNew = async (userId: number): Promise<{ address: string }> => {
    const address = generateTempEmailAddress();
    await tempEmailModel.replaceTempEmailForUser({ userId, newAddress: address });
    return { address };
};

export const listInbox = async (
    userId: number,
    opts: { limit: number; offset: number },
): Promise<{ address: string; messages: any[] }> => {
    const currentAddress = await getTempEmailForUser(userId);
    const currentTempEmail = await tempEmailModel.getTempEmailByUserId(userId);
    
    const messages = await tempEmailMessageModel.listByTempEmailId(currentTempEmail!.id, opts);
    return { address: currentAddress.address, messages };
};

export const ingestSendgridInbound = async (payload: {
    to: string;
    from?: string;
    subject?: string;
    text?: string;
    html?: string;
    [key: string]: any;
}): Promise<{ stored: boolean }> => {
    const tempEmail = await tempEmailModel.getByAddress(payload.to);
    if (!tempEmail) {
        return { stored: false };
    }

    await tempEmailMessageModel.createFromInbound({
        tempEmailId: tempEmail.id,
        fromAddress: payload.from ?? null,
        subject: payload.subject ?? null,
        textBody: payload.text ?? null,
        htmlBody: payload.html ?? null,
        raw: payload,
        receivedAt: new Date(),
    });

    return { stored: true };
};

