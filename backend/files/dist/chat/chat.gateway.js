var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { SubscribeMessage, WebSocketGateway, MessageBody, WebSocketServer, ConnectedSocket, WsException } from '@nestjs/websockets';
import { Socket, Server } from "socket.io";
import { ChanType } from '@prisma/client';
import { ChatService } from './service/index.js';
import { UserService } from '../user/user.service.js';
import { Logger } from '@nestjs/common';
import { UserSocketsService } from './chat.userSocketsService.js';
import * as bcrypt from 'bcrypt';
import { players, socketService } from '../main.js';
let ChatGateway = class ChatGateway {
    chatService;
    userSocketsService;
    userService;
    constructor(chatService, userSocketsService, userService) {
        this.chatService = chatService;
        this.userSocketsService = userSocketsService;
        this.userService = userService;
    }
    logger = new Logger('ChatGateway');
    server;
    async handleGetPrivateConversation(client, data) {
        try {
            const { firstUser, secondUser } = data;
            const isBlocked = await this.chatService.isBlocked(firstUser, secondUser);
            const hasBlocked = await this.chatService.hasBlocked(secondUser, firstUser);
            const firstUserChatRoom = 'userID_' + firstUser.toString() + '_room';
            const secondUserChatRoom = 'userID_' + secondUser.toString() + '_room';
            if (isBlocked || hasBlocked) {
                this.server.to(firstUserChatRoom).to(secondUserChatRoom).emit('foundPrivateConversation', []);
                return;
            }
            const conversation = await this.chatService.getPrivateConversation(firstUser, secondUser);
            this.server.to(firstUserChatRoom).to(secondUserChatRoom).emit('foundPrivateConversation', conversation);
        }
        catch (error) {
            console.log(error);
            throw new WsException(error.message || 'Could not get private conversation');
        }
    }
    async handleContactBlocked(client, data) {
        try {
            const { userId, contactId } = data;
            const isBlocked = await this.chatService.isBlocked(userId, contactId);
            const hasBlocked = await this.chatService.hasBlocked(contactId, userId);
            const userChatRoom = 'userID_' + userId.toString() + '_room';
            if (hasBlocked || isBlocked) {
                this.server.to(userChatRoom).emit('foundBlockStatus', true);
            }
            else {
                this.server.to(userChatRoom).emit('foundBlockStatus', false);
            }
        }
        catch (error) {
            console.log(error);
            throw new WsException(error.message || 'Could not create private message');
        }
    }
    async handleCreateMessage(client, data) {
        try {
            const { senderID, recipientID, content } = data;
            const isBlocked = await this.chatService.isBlocked(recipientID, senderID);
            const hasBlocked = await this.chatService.hasBlocked(senderID, recipientID);
            if (isBlocked) {
                throw new WsException('Could not create message user is blocked');
            }
            if (hasBlocked) {
                throw new WsException('Could not create you blocked this user');
            }
            const privateMessage = await this.chatService.createOnePrivMessage(senderID, recipientID, content);
            const senderUserChatRoom = 'userID_' + senderID.toString() + '_room';
            const recipientUserChatRoom = 'userID_' + recipientID.toString() + '_room';
            this.server.to(senderUserChatRoom).to(recipientUserChatRoom).emit('privateMessageCreated', privateMessage);
        }
        catch (error) {
            console.log(error);
            throw new WsException(error.message || 'Could not create private message');
        }
    }
    async handleSendPrivateMessage(client, data) {
        try {
            const { senderID, recipientID, content } = data;
            const isBlocked = await this.chatService.isBlocked(recipientID, senderID);
            const hasBlocked = await this.chatService.hasBlocked(senderID, recipientID);
            if (isBlocked || hasBlocked) {
                const senderUserChatRoom = 'userID_' + senderID.toString() + '_room';
                this.server.to(senderUserChatRoom).emit('privateMessageSent', data);
            }
            else if (!isBlocked && !hasBlocked) {
                const senderUserChatRoom = 'userID_' + senderID.toString() + '_room';
                const recipientUserChatRoom = 'userID_' + recipientID.toString() + '_room';
                this.server.to(senderUserChatRoom).to(recipientUserChatRoom).emit('privateMessageSent', data);
            }
        }
        catch (error) {
            console.log(error);
            throw new WsException(error.message || 'Could not send private message');
        }
    }
    async handleUserIsBlocked(client, data) {
        try {
            const { blockerID, blockeeID } = data;
            const isBlocked = await this.chatService.isBlocked(blockerID, blockeeID);
            const userRoomId = 'userID_' + blockerID.toString() + '_room';
            if (isBlocked) {
                this.server.to(userRoomId).emit('blockInfo', true);
            }
            else {
                this.server.to(userRoomId).emit('blockInfo', false);
            }
        }
        catch (error) {
            console.log(error);
            throw new WsException(error.message || 'could not find out if user is blocked');
        }
    }
    async handleBlockUser(client, data) {
        try {
            const { blockerID, blockeeID } = data;
            const blockeEntity = await this.chatService.blockUser(blockerID, blockeeID);
            const userRoomId = 'userID_' + blockerID.toString() + '_room';
            this.server.to(userRoomId).emit('userBlocked');
        }
        catch (error) {
            console.log(error);
            throw new WsException(error.message || 'Could not block user');
        }
    }
    async handleUnblockUser(client, data) {
        try {
            const { blockerID, blockeeID } = data;
            await this.chatService.unblockUser(blockerID, blockeeID);
            const userRoomId = 'userID_' + blockerID.toString() + '_room';
            this.server.to(userRoomId).emit('userUnblocked');
        }
        catch (error) {
            console.log(error);
            throw new WsException(error.message || 'Could not unblock user');
        }
    }
    async onCreateChannel(client, data) {
        try {
            const { name, userId, type, psswd } = data;
            const userRoomId = 'userID_' + userId.toString() + '_room';
            const channel = await this.chatService.createOneChannel(name, userId);
            if (!channel) {
                console.log('MEOOOOW');
                this.server.to(userRoomId).emit('failedToCreateChannel', channel.name);
                return;
            }
            const chanID = channel.id;
            await this.chatService.createOneChanMember(chanID, userId);
            await this.chatService.makeOwnerAdmin(userId, chanID);
            if (!Object.values(ChanType).includes(type)) {
                throw new WsException('Invalid channel type');
            }
            await this.chatService.setChannelType(userId, chanID, ChanType[type]);
            if (type == 'PROTECTED') {
                const saltRounds = 10;
                const hashedPassword = await bcrypt.hash(psswd, saltRounds);
                await this.chatService.setChanPassword(chanID, userId, hashedPassword);
            }
            const userSockets = this.userSocketsService.getUserSocketIds(userId);
            for (const socket of userSockets) {
                if (socket) {
                    const ChanRoomId = 'chan_' + chanID + '_room';
                    socket.join(ChanRoomId);
                }
            }
            this.server.emit('channelCreated', channel);
            this.server.to(userRoomId).emit('joinnedRoom', channel.name);
        }
        catch (error) {
            console.log(error);
            throw new WsException(error.message || 'Could not create channel');
        }
    }
    async handleGetChannel(client, data) {
        try {
            const channel = await this.chatService.findChannelbyId(data.chanId);
            client.emit('channelFound', channel);
        }
        catch (error) {
            console.log(error);
            throw new WsException(error.message || 'Could find channel');
        }
    }
    async handleGetUserChansMember(client, userId) {
        try {
            const channels = await this.chatService.findAllChannelsByMember(userId);
            const userRoomId = 'userID_' + userId.toString() + '_room';
            this.server.to(userRoomId).emit('UserChansMemberFound', channels);
        }
        catch (error) {
            console.log(error);
            throw new WsException(error.message || 'Could not get user`s channels');
        }
    }
    async handleGetChannelbyUser(client, userId) {
        try {
            const channels = await this.chatService.findAllChannelsByUserId(userId);
            const userRoomId = 'userID_' + userId.toString() + '_room';
            this.server.to(userRoomId).emit('channelsByUserFound', channels);
        }
        catch (error) {
            console.log(error);
            throw new WsException(error.message || 'Could not get user`s channels');
        }
    }
    async handleGetChannelsUserNonMember(client, userId) {
        try {
            const channels = await this.chatService.findAllChannelsNonMember(userId);
            const userRoomId = 'userID_' + userId.toString() + '_room';
            this.server.to(userRoomId).emit('notJoinedChannelsFound', channels);
        }
        catch (error) {
            console.log(error);
            throw new WsException(error.message || 'Could not get channels user is not member');
        }
    }
    async handleChannelMembers(client, data) {
        try {
            const { chanId, userId } = data;
            const members = await this.chatService.findAllMembersByChanID(chanId);
            const userRoomId = 'userID_' + userId.toString() + '_room';
            this.server.to(userRoomId).emit('MembersofChannelFound', members);
        }
        catch (error) {
            console.log(error);
            throw new WsException(error.message || 'Could not get channel members');
        }
    }
    async handleGetPublicChannels(client) {
        try {
            const channels = await this.chatService.findAllPublicChannels();
            this.server.emit('publicChannelsfound', channels);
        }
        catch (error) {
            console.log(error);
            throw new WsException(error.message || 'Could not get public channels');
        }
    }
    async handleGetProtectedChannels(client) {
        try {
            const channels = await this.chatService.findAllProtectedChannels();
            this.server.emit('protectedChannelsfound', channels);
        }
        catch (error) {
            console.log(error);
            throw new WsException(error.message || 'Could not get protected channels');
        }
    }
    async handleGetChanNonMembers(client, data) {
        try {
            const { chanId, userId } = data;
            const nonMembers = await this.chatService.findAllNonMembersByChanId(chanId);
            const userRoomId = 'userID_' + userId.toString() + '_room';
            this.server.to(userRoomId).emit('chanNonMembersFound', nonMembers);
        }
        catch (error) {
            console.log(error);
            throw new WsException(error.message || 'Could not get channel members');
        }
    }
    async handleSendChanMessage(client, data) {
        try {
            const { senderId, senderNick, chanId, content } = data;
            const isMember = await this.chatService.isMember(chanId, senderId);
            if (!isMember) {
                const userRoomId = 'userID_' + senderId.toString() + '_room';
                this.server.to(userRoomId).emit('userIsNotMember');
                throw new WsException('user not in channel');
            }
            const isMuted = await this.chatService.isMuted(chanId, senderId);
            if (isMuted) {
                const userRoomId = 'userID_' + senderId.toString() + '_room';
                this.server.to(userRoomId).emit('userIsMuted');
                throw new WsException('user is muted');
            }
            const chanMessage = await this.chatService.createOneChanMessage(senderId, senderNick, chanId, content);
            const ChanRoomId = 'chan_' + chanId + '_room';
            this.server.to(ChanRoomId).emit('SentChanMessage', chanMessage);
        }
        catch (error) {
            console.log(error);
            throw new WsException(error.message || 'Could not send message to channel');
        }
    }
    async handleGetChannelMessages(client, data) {
        try {
            const { chanId, userId } = data;
            const isMember = await this.chatService.isMember(chanId, userId);
            if (!isMember) {
                const userRoomId = 'userID_' + userId.toString() + '_room';
                this.server.to(userRoomId).emit('userIsMuted');
                throw new WsException('user not in channel');
            }
            const messages = await this.chatService.findAllChanMessages(chanId);
            const userData = await this.chatService.getUserFromSocket(client);
            const userRoomId = 'userID_' + userData.id.toString() + '_room';
            this.server.to(userRoomId).emit('channelMessagesFound', { messages: messages, chanId: chanId });
            ;
        }
        catch (error) {
            console.log(error);
            throw new WsException(error.message || 'Could not channel messages');
        }
    }
    async handleJoinChannel(client, data) {
        try {
            const { chanID, userID } = data;
            console.log("join public channel");
            const userRoomId = 'userID_' + userID.toString() + '_room';
            const channel = await this.chatService.findChannelbyId(chanID);
            const isBanned = await this.chatService.isBanned(chanID, userID);
            if (isBanned) {
                this.server.to(userRoomId).emit('userIsBanned', channel.name);
                throw new WsException('Chan member is banned');
            }
            await this.chatService.createOneChanMember(chanID, userID);
            const userSockets = this.userSocketsService.getUserSocketIds(userID);
            for (const socket of userSockets) {
                if (socket) {
                    const ChanRoomId = 'chan_' + chanID + '_room';
                    socket.join(ChanRoomId);
                }
            }
            this.server.to(userRoomId).emit('joinnedRoom', channel.name);
            const user = await this.userService.findOneById(userID);
            const ChanRoomId = 'chan_' + chanID + '_room';
            const content = 'I just joined the channel 😸';
            const joinMessage = await this.chatService.createOneChanMessage(userID, user.nickname, chanID, content);
            this.server.to(ChanRoomId).emit('userJoinnedRoom');
            this.server.to(ChanRoomId).emit('SentChanMessage', joinMessage);
        }
        catch (error) {
            console.log(error);
            throw new WsException(error.message || 'Could not public or private channel');
        }
    }
    async handleJoinProtectedChannel(client, data) {
        try {
            console.log('joining protected channel');
            const { chanID, userID, password } = data;
            const isBanned = await this.chatService.isBanned(chanID, userID);
            const userRoomId = 'userID_' + userID.toString() + '_room';
            const channel = await this.chatService.findChannelbyId(chanID);
            if (isBanned) {
                this.server.to(userRoomId).emit('userIsBanned', channel.name);
                return;
            }
            const passwordMatches = await this.chatService.psswdMatch(chanID, password);
            if (!passwordMatches) {
                this.server.to(userRoomId).emit('wrongPassword', channel.name);
                throw new WsException('password does not match');
            }
            console.log('passed passwd matches');
            const chanMember = await this.chatService.createOneChanMember(chanID, userID);
            const userSockets = this.userSocketsService.getUserSocketIds(userID);
            for (const socket of userSockets) {
                if (socket) {
                    const ChanRoomId = 'chan_' + chanID + '_room';
                    socket.join(ChanRoomId);
                }
            }
            this.server.to(userRoomId).emit('joinnedProtectedChannel', channel.name);
            const user = await this.userService.findOneById(userID);
            const ChanRoomId = 'chan_' + chanID + '_room';
            const content = 'I just joined the channel 😸';
            const joinMessage = await this.chatService.createOneChanMessage(userID, user.nickname, chanID, content);
            this.server.to(ChanRoomId).emit('SentChanMessage', joinMessage);
        }
        catch (error) {
            console.log(error);
            throw new WsException(error.message || 'Could not join protected channel');
        }
    }
    async handleAddUsersToChannel(client, data) {
        try {
            const { chanID, adminId, userIds } = data;
            const isAdmin = await this.chatService.isAdmin(chanID, adminId);
            if (!isAdmin) {
                throw new WsException('Cannot add users to channel, not admin');
            }
            const channel = await this.chatService.findChannelbyId(chanID);
            const userDetails = await Promise.all(userIds.map(userId => this.userService.findOneById(userId)));
            for (let i = 0; i < userIds.length; i++) {
                let userId = userIds[i];
                let user = userDetails[i];
                let isBanned = await this.chatService.isBanned(chanID, userId);
                if (isBanned) {
                    const userRoomId = 'userID_' + adminId.toString() + '_room';
                    this.server.to(userRoomId).emit('joinErrorUserIsBanned');
                    continue;
                }
                await this.chatService.createOneChanMember(chanID, userId);
                const userSockets = this.userSocketsService.getUserSocketIds(userId);
                for (const socket of userSockets) {
                    if (socket) {
                        const ChanRoomId = 'chan_' + chanID + '_room';
                        socket.join(ChanRoomId);
                    }
                }
                const userRoomId = 'userId_' + userId.toString() + '_room';
                this.server.to(userRoomId).emit('addedToRoom', channel.name);
                const ChanRoomId = 'chan_' + chanID + '_room';
                const content = 'I just joined the channel 😸';
                const joinMessage = await this.chatService.createOneChanMessage(userId, user.nickname, chanID, content);
                this.server.to(ChanRoomId).emit('SentChanMessage', joinMessage);
            }
        }
        catch (error) {
            console.log(error);
            throw new WsException(error.message || 'Could not public or private channel');
        }
    }
    async handleIsMember(client, data) {
        try {
            const { chanId, memberId, userId } = data;
            const isMember = await this.chatService.isMember(chanId, memberId);
            const ChanRoomId = 'chan_' + chanId + '_room';
            const memberRoomId = 'userID_' + userId + '_room';
            this.server.to(memberRoomId).emit('foundIsMember', isMember);
        }
        catch (error) {
            console.log(error);
            throw new WsException(error.message || 'Could not make member admin');
        }
    }
    async handleIsMemberAdmin(client, data) {
        try {
            const { chanId, userId, memberId } = data;
            const isAdmin = await this.chatService.isAdmin(chanId, memberId);
            const ChanRoomId = 'chan_' + chanId + '_room';
            const memberRoomId = 'userID_' + userId + '_room';
            this.server.to(memberRoomId).emit('foundAdminStatus', isAdmin);
        }
        catch (error) {
            console.log(error);
            throw new WsException(error.message || 'Could not make member admin');
        }
    }
    async handleIsChanOwner(client, data) {
        try {
            const { chanId, userId, memberId } = data;
            const isOwner = await this.chatService.isOwner(chanId, memberId);
            const ChanRoomId = 'chan_' + chanId + '_room';
            const memberRoomId = 'userID_' + userId + '_room';
            this.server.to(memberRoomId).emit('foundOwnerStatus', isOwner);
        }
        catch (error) {
            console.log(error);
            throw new WsException(error.message || 'Could not make member admin');
        }
    }
    async handleMuteMember(client, data) {
        try {
            const { chanId, memberToMuteId, adminId, muteDuration } = data;
            const mutedMember = await this.chatService.muteMember(data);
            const ChanRoomId = 'chan_' + chanId + '_room';
            const mutedMemberRoomId = 'userID_' + memberToMuteId.toString() + '_room';
            const channel = await this.chatService.findChannelbyId(chanId);
            const chan_name = channel.name;
            this.server.to(mutedMemberRoomId).emit('youHaveBeenMuted', chan_name);
            this.server.to(ChanRoomId).emit('memberMuted');
        }
        catch (error) {
            console.log(error);
            throw new WsException(error.message || 'Could not mute member');
        }
    }
    async handleBanMember(client, data) {
        try {
            console.log("TOBAN");
            const { chanId, memberToBanId, adminId } = data;
            const content = 'I was banned from the channel 🙀';
            const user = await this.userService.findOneById(memberToBanId);
            const joinMessage = await this.chatService.createOneChanMessage(memberToBanId, user.nickname, chanId, content);
            await this.chatService.banMember(data);
            const ChanRoomId = 'chan_' + chanId + '_room';
            const userSockets = this.userSocketsService.getUserSocketIds(memberToBanId);
            for (const socket of userSockets) {
                if (socket) {
                    const ChanRoomId = 'chan_' + chanId + '_room';
                    socket.leave(ChanRoomId);
                }
            }
            const bannedMemberRoomId = 'userID_' + memberToBanId.toString() + '_room';
            const channel = await this.chatService.findChannelbyId(chanId);
            const chan_name = channel.name;
            this.server.to(ChanRoomId).emit('memberBanned');
            this.server.to(ChanRoomId).emit('SentChanMessage', joinMessage);
            this.server.to(bannedMemberRoomId).emit('youWereBanned', chan_name);
        }
        catch (error) {
            console.log(error);
            throw new WsException(error.message || 'Could not ban Member');
        }
    }
    async handleKickMember(client, data) {
        try {
            const { chanId, memberToKickId, adminId } = data;
            const content = 'I was kicked from the channel 😿';
            const user = await this.userService.findOneById(memberToKickId);
            await this.chatService.createOneChanMessage(memberToKickId, user.nickname, chanId, content);
            const kickerRoomID = 'userID_' + chanId.toString() + '_room';
            await this.chatService.kickMember(data);
            const ChanRoomId = 'chan_' + chanId + '_room';
            const userSockets = this.userSocketsService.getUserSocketIds(memberToKickId);
            for (const socket of userSockets) {
                if (socket) {
                    const ChanRoomId = 'chan_' + chanId + '_room';
                    socket.leave(ChanRoomId);
                }
            }
            const kickedMemberRoomId = 'userID_' + memberToKickId.toString() + '_room';
            const channel = await this.chatService.findChannelbyId(chanId);
            const chan_name = channel.name;
            this.server.to(kickedMemberRoomId).emit('youHaveBeenKicked', chan_name);
            this.server.to(ChanRoomId).emit('memberKicked');
        }
        catch (error) {
            console.log(error);
            throw new WsException(error.message || 'Could not kick member');
        }
    }
    async handleMakeMemberAdmin(client, data) {
        try {
            console.log("ENTERING MAKE MEMBER ADMIN");
            const { chanId, memberId, chanOwnerId } = data;
            await this.chatService.makeChanAdmin(data);
            const memberRoomId = 'userID_' + memberId + '_room';
            const ChanRoomId = 'chan_' + chanId + '_room';
            const channel = await this.chatService.findChannelbyId(chanId);
            const chan_name = channel.name;
            const ownerRoomId = 'userID_' + chanOwnerId + '_room';
            this.server.to(ChanRoomId).emit('newAdminInRoom');
            this.server.to(ownerRoomId).emit('succededInMakingMemberAdmin');
            this.server.to(memberRoomId).emit('youWereMadeAdmin', chan_name);
        }
        catch (error) {
            console.log(error);
            throw new WsException(error.message || 'Could not make member admin');
        }
    }
    async handleRemoveAdminPriv(client, data) {
        try {
            console.log("ENTERING REMOVE MEMBER ADMIN");
            const { chanId, memberId, chanOwnerId } = data;
            const updatedChanMember = await this.chatService.removeChanAdmin(data);
            const memberRoomId = 'userID_' + memberId + '_room';
            const ChanRoomId = 'chan_' + chanId + '_room';
            console.log("updatedChanMember");
            const channel = await this.chatService.findChannelbyId(chanId);
            const chan_name = channel.name;
            const ownerRoomId = 'userID_' + chanOwnerId + '_room';
            this.server.to(ChanRoomId).emit('newAdminInRoom');
            this.server.to(ownerRoomId).emit('succededInRemovingMemberAdmin');
            this.server.to(memberRoomId).emit('youWereRemovedAsAdmin', chan_name);
        }
        catch (error) {
            console.log(error);
            throw new WsException(error.message || 'Could not make member admin');
        }
    }
    async handleLeaveChannel(client, data) {
        try {
            console.log("leaving channel");
            const { chanId, userId } = data;
            const content = 'I just left the channel 😿';
            const user = await this.userService.findOneById(userId);
            const joinMessage = await this.chatService.createOneChanMessage(userId, user.nickname, chanId, content);
            await this.chatService.leaveChannel(chanId, userId);
            const members = await this.chatService.findAllMembersByChanID(chanId);
            if (members.length === 0) {
                await this.chatService.deleteChannel(chanId);
                this.server.emit('EmptyChannelDeleted');
            }
            const ChanRoomId = 'chan_' + chanId + '_room';
            const userSockets = this.userSocketsService.getUserSocketIds(userId);
            for (const socket of userSockets) {
                if (socket) {
                    const ChanRoomId = 'chan_' + chanId + '_room';
                    socket.leave(ChanRoomId);
                }
            }
            const userRoom = 'userID_' + userId.toString() + '_room';
            const channel = await this.chatService.findChannelbyId(chanId);
            const response = {
                chan_name: channel.name,
                user_nickname: user.nickname
            };
            if (members.length === 0) {
                await this.chatService.deleteChannel(chanId);
                this.server.emit('EmptyChannelDeleted');
            }
            this.server.to(ChanRoomId).emit('SentChanMessage', joinMessage);
            this.server.to(ChanRoomId).emit('userLeftChannel', response);
            this.server.to(userRoom).emit('youLeftChannel', response);
        }
        catch (error) {
            console.log(error);
            throw new WsException(error.message || 'user could not leave channel');
        }
    }
    async handleSetChannelName(client, data) {
        try {
            const { chanMember, chanId, newChanName } = data;
            const updatedChannel = await this.chatService.setChanName(data);
            const ChanRoomId = 'chan_' + chanId + '_room';
            const chanName = updatedChannel.name;
            this.server.to(ChanRoomId).emit('chanNameChanged', chanName);
        }
        catch (error) {
            console.log(error);
            throw new WsException(error.message || 'Could not set channel name');
        }
    }
    async handleSetNewUserPassword(client, data) {
        try {
            const { chanId, userId, newPasswd } = data;
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(newPasswd, saltRounds);
            const updatedChannel = await this.chatService.setChanPassword(chanId, userId, hashedPassword);
            const ChanRoomId = 'chan_' + chanId + '_room';
            let content = 'I changed the channel`s password';
            const user = await this.userService.findOneById(userId);
            const message = await this.chatService.createOneChanMessage(userId, user.nickname, chanId, content);
            this.server.to(ChanRoomId).emit('chanPasswordChanged');
            this.server.to(ChanRoomId).emit('SentChanMessage', message);
            const userRoomId = 'userID_' + userId.toString() + '_room';
            this.server.to(userRoomId).emit('chanPasswordChangeSuccessful');
        }
        catch (error) {
            console.log(error);
            throw new WsException(error.message || 'Could not set new password');
        }
    }
    async handleSetChannelType(client, data) {
        try {
            const { userId, chanId, newChanType, password } = data;
            console.log("inside set channel type");
            if (!Object.values(ChanType).includes(newChanType)) {
                throw new WsException('Invalid channel type');
            }
            console.log("after checking it is a type");
            console.log("newChanType: ", newChanType);
            console.log("password: ", password);
            if (newChanType === 'PROTECTED' && password) {
                console.log("changing to PROTECTED");
                if (password == '') {
                    throw new WsException('Password cannot be empty');
                }
                console.log("password is valid");
                const saltRounds = 10;
                const hashedPassword = await bcrypt.hash(password, saltRounds);
                await this.chatService.setChanPassword(chanId, userId, hashedPassword);
                console.log("password was set");
            }
            else {
                await this.chatService.removeChanPassword(chanId, userId);
            }
            const updated_channel = await this.chatService.setChannelType(userId, chanId, ChanType[newChanType]);
            console.log("channel type was changed");
            console.log("changed_channel: ", updated_channel);
            const ChanRoomId = 'chan_' + chanId + '_room';
            let content = 'I changed the channel type to ';
            content += newChanType;
            const user = await this.userService.findOneById(userId);
            const message = await this.chatService.createOneChanMessage(userId, user.nickname, chanId, content);
            this.server.emit('chanTypeChanged', newChanType);
            this.server.to(ChanRoomId).emit('SentChanMessage', message);
        }
        catch (error) {
            console.log(error);
            throw new WsException(error.message || 'Could not set channel type');
        }
    }
    async handleDeleteChannel(client, data) {
        try {
            const { userId, chanId, chanName } = data;
            console.log("inside set channel type");
            await this.chatService.deleteChannel(chanId);
            const ChanRoomId = 'chan_' + chanId + '_room';
            const sockets = await this.server.in(ChanRoomId).fetchSockets();
            for (const socket of sockets) {
                socket.leave(ChanRoomId);
            }
            this.server.emit('channelDeleted', chanName);
        }
        catch (error) {
            console.log(error);
            throw new WsException(error.message || 'Could not delete channel');
        }
    }
    async handleUserInfo(client) {
        try {
            const userData = await this.chatService.getUserFromSocket(client);
            if (!userData) {
                throw new WsException('user was not found');
            }
            const { id, email, nickname, avatarFilename } = userData;
            const userRoomId = 'userID_' + id.toString() + '_room';
            this.server.to(userRoomId).emit('userInfo', {
                id,
                email,
                nickname,
                avatarFilename,
            });
        }
        catch (error) {
            console.log(error);
            throw new WsException(error.message || 'Could get user info');
        }
    }
    async handleGetUserStatus(client, data) {
        try {
            const { userId, memberId } = data;
            const userSockets = this.userSocketsService.getUserSocketIds(memberId);
            const userRoomId = 'userID_' + userId.toString() + '_room';
            if (userSockets.length === 0) {
                this.server.to(userRoomId).emit('foundUserStatus', { status: false, memberId });
            }
            else {
                this.server.to(userRoomId).emit('foundUserStatus', { status: true, memberId });
            }
        }
        catch (error) {
            console.log(error);
            throw new WsException(error.message || 'Could not get user info');
        }
    }
    async handleGetUsersStartBy(client, data) {
        try {
            const { startBy, userId } = data;
            const users = await this.chatService.findUserStartsby(startBy, userId);
            const userRoomId = 'userID_' + userId.toString() + '_room';
            this.server.to(userRoomId).emit('usersStartByFound', users);
        }
        catch (error) {
            console.log(error);
            throw new WsException(error.message || 'Could not get users that start by');
        }
    }
    async handleGetAllUsers(client) {
        try {
            let users = await this.userService.findAll();
            if (!users) {
                throw new WsException('users were not found');
            }
            const userData = await this.chatService.getUserFromSocket(client);
            if (!userData) {
                throw new WsException('user was not found');
            }
            users = users.filter(user => user.id !== userData.id);
            const userRoomId = 'userID_' + userData.id.toString() + '_room';
            this.server.to(userRoomId).emit('allUsersFound', users);
        }
        catch (error) {
            console.log(error);
            throw new WsException(error.message || 'Could not get all users');
        }
    }
    async handleGameInvitation(client, data) {
        try {
            console.log('SENDING INVITATION');
            const { inviter, invited, inviterNick, invitedNick } = data;
            const inviterRoomId = 'userID_' + inviter.toString() + '_room';
            const invitedRoomId = 'userID_' + invited.toString() + '_room';
            this.server.to(invitedRoomId).emit('youHaveBeenInvitedToPlay', { inviterNick, inviterID: inviter });
            this.server.to(inviterRoomId).emit('playInvitationSend', invitedNick);
        }
        catch (error) {
            console.log(error);
            throw new WsException(error.message || 'Could not invite user to play');
        }
    }
    async handleGameConfirmation(client, data) {
        try {
            console.log('CONFIRMING INVITATION');
            const { inviter, invited, response, inviterNick, invitedNick } = data;
            const inviterRoomId = 'userID_' + inviter.toString() + '_room';
            const invitedRoomId = 'userID_' + invited.toString() + '_room';
            console.log("inviteR: ", inviterNick);
            console.log("inviteD: ", invitedNick);
            if (response === true) {
                this.server.to(invitedRoomId).emit('youAcceptedGame', { inviterNick, inviterID: inviter, invitedNick, invitedID: invited });
                this.server.to(inviterRoomId).emit('gameAccepted', { inviterNick, inviterID: inviter, invitedNick, invitedID: invited });
            }
            else if (response === false) {
                this.server.to(invitedRoomId).emit('youRejectedGame', inviterNick);
                this.server.to(inviterRoomId).emit('gameRejected', inviterNick, inviter, invitedNick, invited);
            }
        }
        catch (error) {
            console.log(error);
            throw new WsException(error.message || 'Could not invite user to play');
        }
    }
    async handleFriendStates(socket, payload) {
        let response = {};
        for (let userID of payload) {
            let userChatSockets = this.userSocketsService.getUserSocketIds(userID);
            let userGameSockets = socketService.getUserSocketIds(userID);
            if (userChatSockets.length == 0) {
                response[userID] = 'offline';
                continue;
            }
            else
                response[userID] = 'online';
            for (let userSocket of userGameSockets) {
                let player = players[userSocket.id];
                console.log("socketID:", userSocket.id);
                if (player !== undefined && player.workerId !== undefined) {
                    response[userID] = 'in game';
                    break;
                }
            }
        }
        socket?.emit('updatedState', response);
    }
    afterInit(server) {
        this.logger.log('initialized');
    }
    async handleConnection(client, ...args) {
        console.log("#####################  CONNECTION  ###########################");
        console.log('success connected with client id', client.id);
        try {
            const userData = await this.chatService.getUserFromSocket(client);
            console.log();
            if (!userData) {
                console.log("GOING TO DISCONNECT");
                client.disconnect();
            }
            else {
                const userID = userData.id;
                const userName = userData.nickname;
                console.log('ON CONNECTION: userID: ', userID);
                console.log("ON CONNECTION: userName:", userName);
                this.userSocketsService.setUser(userID, client);
                const userRoomId = 'userID_' + userID.toString() + '_room';
                const userChannels = await this.chatService.findAllChannelsByMember(userID);
                client.join(userRoomId);
                userChannels.forEach(channel => {
                    const chanRoomId = 'chan_' + channel.chanId + '_room';
                    client.join(chanRoomId);
                });
                client.emit('connectionResult', { msg: 'connected successfully' });
            }
        }
        catch (error) {
            console.log(error);
            client.disconnect();
        }
    }
    async handleDisconnect(client) {
        console.log("*********************DISCONNECTION************************************");
        console.log('CLIENT DISCONNETING: ', client.id);
        try {
            const userData = await this.chatService.getUserFromSocket(client);
            if (userData) {
                const userID = userData.id;
                const userName = userData.nickname;
                console.log("DISCONNECTION: userid:", userID);
                console.log("DISCONNECTION: userName:", userName);
                this.userSocketsService.deleteUserSocket(userID, client);
                const userWithSocket = this.userSocketsService.getUserSocketIds(userID);
                const userRoomId = 'userID_' + userID.toString() + '_room';
                client.leave(userRoomId);
                const userChannels = await this.chatService.findAllChannelsByMember(userID);
                userChannels.forEach(chanMember => {
                    const chanRoomId = 'chan_' + chanMember.chanId + '_room';
                    client.leave(chanRoomId);
                });
            }
        }
        catch (error) {
            console.log(error);
            throw new WsException(error.message || 'Handle Disconnect');
        }
    }
};
__decorate([
    WebSocketServer(),
    __metadata("design:type", Server)
], ChatGateway.prototype, "server", void 0);
__decorate([
    SubscribeMessage('getPrivateConversation'),
    __param(0, ConnectedSocket()),
    __param(1, MessageBody()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Socket, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleGetPrivateConversation", null);
__decorate([
    SubscribeMessage('getBlockStatus'),
    __param(0, ConnectedSocket()),
    __param(1, MessageBody()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Socket, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleContactBlocked", null);
__decorate([
    SubscribeMessage('createPrivateMessage'),
    __param(0, ConnectedSocket()),
    __param(1, MessageBody()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Socket, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleCreateMessage", null);
__decorate([
    SubscribeMessage('sendPrivateMessage'),
    __param(0, ConnectedSocket()),
    __param(1, MessageBody()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Socket, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleSendPrivateMessage", null);
__decorate([
    SubscribeMessage('userIsBlocked'),
    __param(0, ConnectedSocket()),
    __param(1, MessageBody()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Socket, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleUserIsBlocked", null);
__decorate([
    SubscribeMessage('blockUser'),
    __param(0, ConnectedSocket()),
    __param(1, MessageBody()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Socket, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleBlockUser", null);
__decorate([
    SubscribeMessage('unblockUser'),
    __param(0, ConnectedSocket()),
    __param(1, MessageBody()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Socket, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleUnblockUser", null);
__decorate([
    SubscribeMessage('createChannel'),
    __param(0, ConnectedSocket()),
    __param(1, MessageBody()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Socket, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "onCreateChannel", null);
__decorate([
    SubscribeMessage('GetChannel'),
    __param(0, ConnectedSocket()),
    __param(1, MessageBody()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Socket, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleGetChannel", null);
__decorate([
    SubscribeMessage('GetUserChansMember'),
    __param(0, ConnectedSocket()),
    __param(1, MessageBody()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Socket, Number]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleGetUserChansMember", null);
__decorate([
    SubscribeMessage('GetChannelsByUser'),
    __param(0, ConnectedSocket()),
    __param(1, MessageBody()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Socket, Number]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleGetChannelbyUser", null);
__decorate([
    SubscribeMessage('GetNotJoinedChannels'),
    __param(0, ConnectedSocket()),
    __param(1, MessageBody()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Socket, Number]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleGetChannelsUserNonMember", null);
__decorate([
    SubscribeMessage('GetChannelMembers'),
    __param(0, ConnectedSocket()),
    __param(1, MessageBody()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Socket, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleChannelMembers", null);
__decorate([
    SubscribeMessage('GetPublicChannels'),
    __param(0, ConnectedSocket()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Socket]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleGetPublicChannels", null);
__decorate([
    SubscribeMessage('GetProtectedChannels'),
    __param(0, ConnectedSocket()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Socket]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleGetProtectedChannels", null);
__decorate([
    SubscribeMessage('GetChanNonMembers'),
    __param(0, ConnectedSocket()),
    __param(1, MessageBody()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Socket, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleGetChanNonMembers", null);
__decorate([
    SubscribeMessage('sendChanMessage'),
    __param(0, ConnectedSocket()),
    __param(1, MessageBody()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Socket, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleSendChanMessage", null);
__decorate([
    SubscribeMessage('GetChannelMessages'),
    __param(0, ConnectedSocket()),
    __param(1, MessageBody()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Socket, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleGetChannelMessages", null);
__decorate([
    SubscribeMessage('joinChannel'),
    __param(0, ConnectedSocket()),
    __param(1, MessageBody()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Socket, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleJoinChannel", null);
__decorate([
    SubscribeMessage('joinProtectedChannel'),
    __param(0, ConnectedSocket()),
    __param(1, MessageBody()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Socket, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleJoinProtectedChannel", null);
__decorate([
    SubscribeMessage('addUsersToChannel'),
    __param(0, ConnectedSocket()),
    __param(1, MessageBody()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Socket, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleAddUsersToChannel", null);
__decorate([
    SubscribeMessage('isMember'),
    __param(0, ConnectedSocket()),
    __param(1, MessageBody()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Socket, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleIsMember", null);
__decorate([
    SubscribeMessage('isMemberAdmin'),
    __param(0, ConnectedSocket()),
    __param(1, MessageBody()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Socket, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleIsMemberAdmin", null);
__decorate([
    SubscribeMessage('isChanOwner'),
    __param(0, ConnectedSocket()),
    __param(1, MessageBody()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Socket, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleIsChanOwner", null);
__decorate([
    SubscribeMessage('muteMember'),
    __param(0, ConnectedSocket()),
    __param(1, MessageBody()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Socket, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleMuteMember", null);
__decorate([
    SubscribeMessage('banMember'),
    __param(0, ConnectedSocket()),
    __param(1, MessageBody()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Socket, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleBanMember", null);
__decorate([
    SubscribeMessage('kickMember'),
    __param(0, ConnectedSocket()),
    __param(1, MessageBody()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Socket, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleKickMember", null);
__decorate([
    SubscribeMessage('makeMemberAdmin'),
    __param(0, ConnectedSocket()),
    __param(1, MessageBody()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Socket, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleMakeMemberAdmin", null);
__decorate([
    SubscribeMessage('removeAdminPriv'),
    __param(0, ConnectedSocket()),
    __param(1, MessageBody()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Socket, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleRemoveAdminPriv", null);
__decorate([
    SubscribeMessage('leaveChannel'),
    __param(0, ConnectedSocket()),
    __param(1, MessageBody()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Socket, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleLeaveChannel", null);
__decorate([
    SubscribeMessage('setChannelName'),
    __param(0, ConnectedSocket()),
    __param(1, MessageBody()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Socket, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleSetChannelName", null);
__decorate([
    SubscribeMessage('setNewPasswd'),
    __param(0, ConnectedSocket()),
    __param(1, MessageBody()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Socket, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleSetNewUserPassword", null);
__decorate([
    SubscribeMessage('setChannelType'),
    __param(0, ConnectedSocket()),
    __param(1, MessageBody()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Socket, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleSetChannelType", null);
__decorate([
    SubscribeMessage('deleteChannel'),
    __param(0, ConnectedSocket()),
    __param(1, MessageBody()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Socket, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleDeleteChannel", null);
__decorate([
    SubscribeMessage('getUserInfo'),
    __param(0, ConnectedSocket()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Socket]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleUserInfo", null);
__decorate([
    SubscribeMessage('getUserStatus'),
    __param(0, ConnectedSocket()),
    __param(1, MessageBody()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Socket, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleGetUserStatus", null);
__decorate([
    SubscribeMessage('getUserStartsBy'),
    __param(0, ConnectedSocket()),
    __param(1, MessageBody()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Socket, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleGetUsersStartBy", null);
__decorate([
    SubscribeMessage('getAllUsers'),
    __param(0, ConnectedSocket()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Socket]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleGetAllUsers", null);
__decorate([
    SubscribeMessage('gameInvitation'),
    __param(0, ConnectedSocket()),
    __param(1, MessageBody()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Socket, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleGameInvitation", null);
__decorate([
    SubscribeMessage('gameConfirmation'),
    __param(0, ConnectedSocket()),
    __param(1, MessageBody()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Socket, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleGameConfirmation", null);
__decorate([
    SubscribeMessage('friendsState'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Socket, Array]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleFriendStates", null);
ChatGateway = __decorate([
    WebSocketGateway({ cors: {
            origin: '*',
            methods: ['GET', 'POST']
        },
        namespace: 'chat' }),
    __metadata("design:paramtypes", [ChatService,
        UserSocketsService,
        UserService])
], ChatGateway);
export { ChatGateway };
