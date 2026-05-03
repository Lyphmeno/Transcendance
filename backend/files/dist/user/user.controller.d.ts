/// <reference types="multer" />
import { UserService, Character } from "./user.service.js";
import { FriendRequest, User, Achievement } from "@prisma/client";
import { FriendRequestService } from "../friend/friend.service.js";
export declare class UserController {
    private userService;
    private friendRequestService;
    constructor(userService: UserService, friendRequestService: FriendRequestService);
    IsConnected(req: any): Promise<import("@prisma/client/runtime/index.js").GetResult<{
        id: number;
        email: string;
        nickname: string;
        avatarFilename: string;
        story: string;
        rankPoints: number;
        character: string;
        twoFactorAuthStatus: boolean;
        twoFactorAuthSecret: string;
    }, unknown, never> & {}>;
    getAll(): Promise<User[]>;
    changeNickname(req: any, nickname: string): Promise<User>;
    changeStory(req: any, story: string): Promise<User>;
    newAchievement(req: any, achievId: number): Promise<Achievement>;
    uploadAvatar(file: Express.Multer.File, req: any): Promise<User>;
    deleteOneUser(req: any): Promise<import("@prisma/client/runtime/index.js").GetResult<{
        id: number;
        email: string;
        nickname: string;
        avatarFilename: string;
        story: string;
        rankPoints: number;
        character: string;
        twoFactorAuthStatus: boolean;
        twoFactorAuthSecret: string;
    }, unknown, never> & {}>;
    getSelf(req: any): Promise<User>;
    selectCharacter(req: any, character: Character): Promise<User>;
    getOneById(id: number): Promise<User>;
    getUserAchievements(id: number): Promise<Achievement[]>;
    getTopPlayers(count: number): Promise<User[]>;
    modifyRank(req: any, pts: number): Promise<User>;
    getOwnFriendsIDs(req: any): Promise<number[]>;
    getFriendsRequestsSent(req: any): Promise<FriendRequest[]>;
    getFriendsRequestsReceived(req: any): Promise<FriendRequest[]>;
    addFriend(req: any, friendID: number): Promise<FriendRequest>;
    deleteFriend(req: any, friendID: number): Promise<FriendRequest>;
}
