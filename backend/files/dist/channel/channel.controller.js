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
import { Controller, Get, Param, ParseIntPipe, Post, Req, UseGuards } from "@nestjs/common";
import { JwtGuard } from "../auth/guards/JwtGuard.js";
import { ChannelService } from "./channel.service.js";
import { ChannelMemberGuard } from "./channel-message.guard.js";
let ChannelController = class ChannelController {
    channelService;
    constructor(channelService) {
        this.channelService = channelService;
    }
    async getAllChansByMember(req) {
        return this.channelService.findAllChannelsByMember(req.user.id);
    }
    async addMemberToChannel(req, chanId) {
        return this.channelService.createOneChanMember(chanId, req.user.id);
    }
    async getLastChanMessages(chanId, count) {
        return this.channelService.findManyChanMessages(chanId, count);
    }
    async getAllChanMessages(chanId) {
        return this.channelService.findAllChanMessages(chanId);
    }
    async getAllMembersByChan(chanId) {
        return this.channelService.findAllMembersByChanID(chanId);
    }
    async createChannel(req, name) {
        return this.channelService.createOneChannel(name, req.user.id);
    }
};
__decorate([
    Get('own'),
    UseGuards(JwtGuard),
    __param(0, Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ChannelController.prototype, "getAllChansByMember", null);
__decorate([
    Post(':id/members'),
    UseGuards(JwtGuard),
    __param(0, Req()),
    __param(1, Param('id', ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], ChannelController.prototype, "addMemberToChannel", null);
__decorate([
    Get(':id/messages/:count'),
    UseGuards(JwtGuard, ChannelMemberGuard),
    __param(0, Param('id')),
    __param(1, Param('count')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], ChannelController.prototype, "getLastChanMessages", null);
__decorate([
    Get(':id/messages'),
    UseGuards(JwtGuard, ChannelMemberGuard),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ChannelController.prototype, "getAllChanMessages", null);
__decorate([
    Get(':id/members'),
    UseGuards(JwtGuard),
    __param(0, Param('id', ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ChannelController.prototype, "getAllMembersByChan", null);
__decorate([
    Post(':name'),
    UseGuards(JwtGuard),
    __param(0, Req()),
    __param(1, Param('name')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], ChannelController.prototype, "createChannel", null);
ChannelController = __decorate([
    Controller('channels'),
    __metadata("design:paramtypes", [ChannelService])
], ChannelController);
export { ChannelController };
