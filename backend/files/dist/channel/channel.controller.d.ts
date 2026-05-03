import { ChannelService } from "./channel.service.js";
import { ChanMember, ChanMessage, Channel } from "@prisma/client";
export declare class ChannelController {
    private channelService;
    constructor(channelService: ChannelService);
    getAllChansByMember(req: any): Promise<ChanMember[]>;
    addMemberToChannel(req: any, chanId: number): Promise<ChanMember>;
    getLastChanMessages(chanId: number, count: number): Promise<ChanMessage[]>;
    getAllChanMessages(chanId: number): Promise<ChanMessage[]>;
    getAllMembersByChan(chanId: number): Promise<ChanMember[]>;
    createChannel(req: any, name: string): Promise<Channel>;
}
