import { ChanMember } from "@prisma/client";
export declare function muteMember(data: {
    chanId: number;
    memberToMuteId: number;
    adminId: number;
    muteDuration: number;
}): Promise<ChanMember | null>;
export declare function kickMember(data: {
    chanId: number;
    memberToKickId: number;
    adminId: number;
}): Promise<void>;
export declare function banMember(data: {
    chanId: number;
    memberToBanId: number;
    adminId: number;
}): Promise<ChanMember | null>;
export declare function leaveChannel(chanId: number, memberId: number): Promise<void>;
