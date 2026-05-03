import { PrismaService } from "../prisma/prisma.service.js";
import { FriendRequest } from "@prisma/client";
export declare class FriendRequestService {
    private prisma;
    constructor(prisma: PrismaService);
    createOne(requesterID: number, requesteeID: number): Promise<FriendRequest>;
    deleteOne(requesterID: number, requesteeID: number): Promise<FriendRequest>;
    findAllRequestsSent(id: number): Promise<FriendRequest[]>;
    findAllRequestsReceived(id: number): Promise<FriendRequest[]>;
    findAllFriends(id: number): Promise<number[]>;
}
