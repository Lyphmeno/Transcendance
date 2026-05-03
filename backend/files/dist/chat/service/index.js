var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from '@nestjs/common';
import { AuthService } from '../../auth/auth.service.js';
import { UserService } from '../../user/user.service.js';
import { PrismaService } from 'nestjs-prisma';
import { getUserFromSocket } from './getUserFromSocket.js';
import { createChannel, createOneChanMember, createOneChanMessage, createOneChannel, addUserToChannel } from './createChannel.js';
import { setChanName, setChanPassword, setChannelType, makeChanAdmin, makeOwnerAdmin, removeChanAdmin, removeChanPassword } from './updateChannel.js';
import { muteMember, banMember, kickMember, leaveChannel } from './members.js';
import { findAllChanMessages, findAllChannelsByMember, findAllMembersByChanID, findChannelbyId, findManyChanMessages, findAllProtectedChannels, findAllPublicChannels, findUserStartsby, findAllChannelsByUserId, findAllChannelsNonMember, findAllNonMembersByChanId } from './finders.js';
import { isAdmin, isMember, isOwner, psswdMatch, isBanned, isMuted } from './verifications.js';
import { getPrivateConversation, createOnePrivMessage, blockUser, unblockUser, isBlocked, hasBlocked } from './private.js';
import { deleteChannel } from './deletion.js';
let ChatService = class ChatService {
    authservice;
    prisma;
    userService;
    constructor(authservice, prisma, userService) {
        this.authservice = authservice;
        this.prisma = prisma;
        this.userService = userService;
    }
    getUserFromSocket = getUserFromSocket;
    createChannel = createChannel;
    createOneChanMember = createOneChanMember;
    createOneChanMessage = createOneChanMessage;
    createOneChannel = createOneChannel;
    addUserToChannel = addUserToChannel;
    setChanName = setChanName;
    setChanPassword = setChanPassword;
    setChannelType = setChannelType;
    makeChanAdmin = makeChanAdmin;
    makeOwnerAdmin = makeOwnerAdmin;
    removeChanAdmin = removeChanAdmin;
    removeChanPassword = removeChanPassword;
    muteMember = muteMember;
    banMember = banMember;
    kickMember = kickMember;
    leaveChannel = leaveChannel;
    findAllChanMessages = findAllChanMessages;
    findAllChannelsByMember = findAllChannelsByMember;
    findAllMembersByChanID = findAllMembersByChanID;
    findChannelbyId = findChannelbyId;
    findManyChanMessages = findManyChanMessages;
    findAllPublicChannels = findAllPublicChannels;
    findAllProtectedChannels = findAllProtectedChannels;
    findUserStartsby = findUserStartsby;
    findAllChannelsByUserId = findAllChannelsByUserId;
    findAllChannelsNonMember = findAllChannelsNonMember;
    findAllNonMembersByChanId = findAllNonMembersByChanId;
    isAdmin = isAdmin;
    isMember = isMember;
    isOwner = isOwner;
    psswdMatch = psswdMatch;
    isBanned = isBanned;
    isMuted = isMuted;
    deleteChannel = deleteChannel;
    getPrivateConversation = getPrivateConversation;
    createOnePrivMessage = createOnePrivMessage;
    blockUser = blockUser;
    unblockUser = unblockUser;
    isBlocked = isBlocked;
    hasBlocked = hasBlocked;
};
ChatService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [AuthService,
        PrismaService,
        UserService])
], ChatService);
export { ChatService };
