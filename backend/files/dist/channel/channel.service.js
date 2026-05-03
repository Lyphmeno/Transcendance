var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service.js";
let ChannelService = class ChannelService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createOneChannel(name, chanOwner) {
        const channel = this.prisma.channel.create({
            data: {
                name,
                chanOwner,
            },
        });
        return channel;
    }
    async createOneChanMember(chanId, memberId) {
        const chanMember = await this.prisma.chanMember.create({
            data: {
                chanId,
                member: memberId,
            },
        });
        return chanMember;
    }
    async findAllMembersByChanID(chanId) {
        const members = await this.prisma.chanMember.findMany({
            where: {
                chanId,
            },
        });
        return members;
    }
    async findAllChannelsByMember(member) {
        const channels = await this.prisma.chanMember.findMany({
            where: {
                member,
            },
        });
        return channels;
    }
    async findManyChanMessages(chanId, count) {
        const messages = await this.prisma.chanMessage.findMany({
            where: {
                chanId,
            },
            orderBy: {
                timeSent: "asc",
            },
            take: count,
        });
        return messages;
    }
    async findAllChanMessages(chanId) {
        const messages = await this.prisma.chanMessage.findMany({
            where: {
                chanId,
            },
            orderBy: {
                timeSent: "asc",
            },
        });
        return messages;
    }
    async isMember(chanId, memberId) {
        const member = await this.prisma.chanMember.findUnique({
            where: {
                chanId_member: {
                    chanId,
                    member: memberId,
                },
            },
        });
        if (member) {
            return true;
        }
        return false;
    }
    async isAdmin(chanId, memberId) {
        const member = await this.prisma.chanMember.findUnique({
            where: {
                chanId_member: {
                    chanId,
                    member: memberId,
                },
            },
        });
        if (member?.isAdmin) {
            return true;
        }
        return false;
    }
    async isOwner(chanId, memberId) {
        const channel = await this.prisma.channel.findUnique({
            where: {
                id: chanId,
            },
        });
        return channel.chanOwner === memberId;
    }
};
ChannelService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService])
], ChannelService);
export { ChannelService };
