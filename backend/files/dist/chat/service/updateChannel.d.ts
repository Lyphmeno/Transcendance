import { ChanMember, Channel } from "@prisma/client";
import { ChanType } from '@prisma/client';
export declare function setChanPassword(chanId: number, userId: number, newPasswd: string): Promise<Channel | null>;
export declare function removeChanPassword(chanId: number, userId: number): Promise<Channel | null>;
export declare function setChanName(data: {
    chanMember: number;
    chanId: number;
    newChanName: string;
}): Promise<Channel | null>;
export declare function setChannelType(userId: number, chanID: number, type: ChanType): Promise<Channel>;
export declare function makeOwnerAdmin(userId: number, chanId: number): Promise<ChanMember | null>;
export declare function makeChanAdmin(data: {
    chanOwnerId: number;
    chanId: number;
    memberId: number;
}): Promise<ChanMember | null>;
export declare function removeChanAdmin(data: {
    chanOwnerId: number;
    chanId: number;
    memberId: number;
}): Promise<ChanMember | null>;
