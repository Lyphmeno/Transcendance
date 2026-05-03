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
let FriendRequestService = class FriendRequestService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createOne(requesterID, requesteeID) {
        const request = await this.prisma.friendRequest.create({
            data: {
                requesterRef: {
                    connect: {
                        id: requesterID,
                    },
                },
                requesteeRef: {
                    connect: {
                        id: requesteeID,
                    },
                },
            },
        });
        return request;
    }
    async deleteOne(requesterID, requesteeID) {
        const request = await this.prisma.friendRequest.delete({
            where: {
                requester_requestee: {
                    requester: requesterID,
                    requestee: requesteeID,
                },
            },
        });
        return request;
    }
    async findAllRequestsSent(id) {
        const requests = await this.prisma.friendRequest.findMany({
            where: {
                requester: id,
            },
        });
        return requests;
    }
    async findAllRequestsReceived(id) {
        const requests = await this.prisma.friendRequest.findMany({
            where: {
                requestee: id,
            },
        });
        return requests;
    }
    async findAllFriends(id) {
        const sent = await this.findAllRequestsSent(id);
        const received = await this.findAllRequestsReceived(id);
        let friends = [];
        for (let s of sent) {
            for (let r of received) {
                if (s.requestee === r.requester) {
                    friends.push(s.requestee);
                }
            }
        }
        return friends;
    }
};
FriendRequestService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService])
], FriendRequestService);
export { FriendRequestService };
