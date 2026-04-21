import { randomUUID } from 'crypto';
import { SessionModel } from '../models/classes/session-model.js';
import { TempEmailMessageModel } from '../models/classes/temp-email-message-model.js';
import type { ISessionModel } from '../models/interfaces/session-model.js';
import { generateTempEmailAddress } from '../utils/temp-email-utils.js';

const sessionModel = new SessionModel();
const tempEmailMessageModel = new TempEmailMessageModel();

export const createSession = async (): Promise<{ token: string; address: string }> => {
    const token = randomUUID();
    const address = generateTempEmailAddress();
    await sessionModel.createSession({ token, address });
    return { token, address };
};

export const getSession = (token: string): Promise<ISessionModel | undefined> => {
    return sessionModel.getByToken(token);
};

export const refreshAddress = async (session: ISessionModel): Promise<{ token: string; address: string }> => {
    const newAddress = generateTempEmailAddress();
    await sessionModel.replaceAddress({ sessionId: session.id, newAddress });
    return { token: session.token, address: newAddress };
};

export const listInbox = async (
    session: ISessionModel,
    opts: { limit: number; offset: number },
): Promise<{ address: string; messages: any[] }> => {
    const messages = await tempEmailMessageModel.listBySessionId(session.id, opts);
    return { address: session.address, messages };
};

export const ingestSendgridInbound = async (payload: {
    to: string;
    from?: string;
    subject?: string;
    text?: string;
    html?: string;
    [key: string]: any;
}): Promise<{ stored: boolean }> => {
    const session = await sessionModel.getByAddress(payload.to);
    if (!session) {
        return { stored: false };
    }

    await tempEmailMessageModel.createFromInbound({
        sessionId: session.id,
        fromAddress: payload.from ?? null,
        subject: payload.subject ?? null,
        textBody: payload.text ?? null,
        htmlBody: payload.html ?? null,
        receivedAt: new Date(),
    });

    return { stored: true };
};
