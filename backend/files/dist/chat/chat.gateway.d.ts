import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit } from '@nestjs/websockets';
import { Socket, Server } from "socket.io";
import { ChatService } from './service/index.js';
import { UserService } from '../user/user.service.js';
import { UserSocketsService } from './chat.userSocketsService.js';
export declare class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {
    private readonly chatService;
    private readonly userSocketsService;
    private readonly userService;
    constructor(chatService: ChatService, userSocketsService: UserSocketsService, userService: UserService);
    private logger;
    server: Server;
    handleGetPrivateConversation(client: Socket, data: {
        firstUser: number;
        secondUser: number;
    }): Promise<void>;
    handleContactBlocked(client: Socket, data: {
        userId: number;
        contactId: number;
    }): Promise<void>;
    handleCreateMessage(client: Socket, data: {
        senderID: number;
        recipientID: number;
        content: string;
    }): Promise<void>;
    handleSendPrivateMessage(client: Socket, data: {
        senderID: number;
        recipientID: number;
        content: string;
    }): Promise<void>;
    handleUserIsBlocked(client: Socket, data: {
        blockerID: number;
        blockeeID: number;
    }): Promise<void>;
    handleBlockUser(client: Socket, data: {
        blockerID: number;
        blockeeID: number;
    }): Promise<void>;
    handleUnblockUser(client: Socket, data: {
        blockerID: number;
        blockeeID: number;
    }): Promise<void>;
    onCreateChannel(client: Socket, data: {
        name: string;
        userId: number;
        type: string;
        psswd?: string;
    }): Promise<void>;
    handleGetChannel(client: Socket, data: {
        chanId: number;
    }): Promise<void>;
    handleGetUserChansMember(client: Socket, userId: number): Promise<void>;
    handleGetChannelbyUser(client: Socket, userId: number): Promise<void>;
    handleGetChannelsUserNonMember(client: Socket, userId: number): Promise<void>;
    handleChannelMembers(client: Socket, data: {
        chanId: number;
        userId: number;
    }): Promise<void>;
    handleGetPublicChannels(client: Socket): Promise<void>;
    handleGetProtectedChannels(client: Socket): Promise<void>;
    handleGetChanNonMembers(client: Socket, data: {
        chanId: number;
        userId: number;
    }): Promise<void>;
    handleSendChanMessage(client: Socket, data: {
        senderId: number;
        senderNick: string;
        chanId: number;
        content: string;
    }): Promise<void>;
    handleGetChannelMessages(client: Socket, data: {
        chanId: number;
        userId: number;
    }): Promise<void>;
    handleJoinChannel(client: Socket, data: {
        chanID: number;
        userID: number;
    }): Promise<void>;
    handleJoinProtectedChannel(client: Socket, data: {
        chanID: number;
        userID: number;
        password: string;
    }): Promise<void>;
    handleAddUsersToChannel(client: Socket, data: {
        adminId: number;
        chanID: number;
        userIds: number[];
    }): Promise<void>;
    handleIsMember(client: Socket, data: {
        chanId: number;
        memberId: number;
        userId: number;
    }): Promise<void>;
    handleIsMemberAdmin(client: Socket, data: {
        chanId: number;
        memberId: number;
        userId: number;
    }): Promise<void>;
    handleIsChanOwner(client: Socket, data: {
        chanId: number;
        memberId: number;
        userId: number;
    }): Promise<void>;
    handleMuteMember(client: Socket, data: {
        chanId: number;
        memberToMuteId: number;
        adminId: number;
        muteDuration: number;
    }): Promise<void>;
    handleBanMember(client: Socket, data: {
        chanId: number;
        memberToBanId: number;
        adminId: number;
    }): Promise<void>;
    handleKickMember(client: Socket, data: {
        chanId: number;
        memberToKickId: number;
        adminId: number;
    }): Promise<void>;
    handleMakeMemberAdmin(client: Socket, data: {
        chanOwnerId: number;
        chanId: number;
        memberId: number;
    }): Promise<void>;
    handleRemoveAdminPriv(client: Socket, data: {
        chanOwnerId: number;
        chanId: number;
        memberId: number;
    }): Promise<void>;
    handleLeaveChannel(client: Socket, data: {
        chanId: number;
        userId: number;
    }): Promise<void>;
    handleSetChannelName(client: Socket, data: {
        chanMember: number;
        chanId: number;
        newChanName: string;
    }): Promise<void>;
    handleSetNewUserPassword(client: Socket, data: {
        chanId: number;
        userId: number;
        newPasswd: string;
    }): Promise<void>;
    handleSetChannelType(client: Socket, data: {
        userId: number;
        chanId: number;
        newChanType: string;
        password?: string;
    }): Promise<void>;
    handleDeleteChannel(client: Socket, data: {
        userId: number;
        chanId: number;
        chanName: string;
    }): Promise<void>;
    handleUserInfo(client: Socket): Promise<void>;
    handleGetUserStatus(client: Socket, data: {
        userId: number;
        memberId: number;
    }): Promise<void>;
    handleGetUsersStartBy(client: Socket, data: {
        startBy: string;
        userId: number;
    }): Promise<void>;
    handleGetAllUsers(client: Socket): Promise<void>;
    handleGameInvitation(client: Socket, data: {
        inviter: number;
        invited: number;
        inviterNick: string;
        invitedNick: string;
    }): Promise<void>;
    handleGameConfirmation(client: Socket, data: {
        inviter: number;
        invited: number;
        response: boolean;
        inviterNick: string;
        invitedNick: string;
    }): Promise<void>;
    handleFriendStates(socket: Socket, payload: number[]): Promise<void>;
    afterInit(server: any): void;
    handleConnection(client: Socket, ...args: any[]): Promise<void>;
    handleDisconnect(client: Socket): Promise<void>;
}
