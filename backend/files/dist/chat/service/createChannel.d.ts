import { ChanType } from '@prisma/client';
import { ChanMember, ChanMessage, Channel } from "@prisma/client";
export declare function createChannel(channelData: {
    name: string;
    type: ChanType;
    passwd?: string;
    chanOwnerRef: {
        connect: {
            id: number;
        };
    };
}): Promise<Channel>;
export declare function createOneChannel(name: string, chanOwner: number): Promise<Channel>;
export declare function createOneChanMember(chanId: number, memberId: number): Promise<ChanMember>;
export declare function addUserToChannel(userId: number, chanID: number): Promise<{
    userId: number;
    joinMessage: string;
}>;
export declare function createOneChanMessage(senderId: number, senderNick: string, chanId: number, content: string): Promise<ChanMessage>;
