import { PrismaService } from "../prisma/prisma.service.js";
import { ChanMember, ChanMessage, Channel } from "@prisma/client";
export declare class ChannelService {
    private prisma;
    constructor(prisma: PrismaService);
    createOneChannel(name: string, chanOwner: number): Promise<Channel>;
    createOneChanMember(chanId: number, memberId: number): Promise<ChanMember>;
    findAllMembersByChanID(chanId: number): Promise<ChanMember[]>;
    findAllChannelsByMember(member: number): Promise<ChanMember[]>;
    findManyChanMessages(chanId: number, count: number): Promise<ChanMessage[]>;
    findAllChanMessages(chanId: number): Promise<ChanMessage[]>;
    isMember(chanId: number, memberId: number): Promise<boolean>;
    isAdmin(chanId: number, memberId: number): Promise<boolean>;
    isOwner(chanId: number, memberId: number): Promise<boolean>;
}
