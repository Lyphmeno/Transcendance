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
import { ChannelService } from "./channel.service.js";
let ChannelMemberGuard = class ChannelMemberGuard {
    channelService;
    constructor(channelService) {
        this.channelService = channelService;
    }
    canActivate(context) {
        const request = context.switchToHttp().getRequest();
        return this.validateRequest(request);
    }
    async validateRequest(request) {
        return this.channelService.isMember(request.params['id'], request.user.id);
    }
};
ChannelMemberGuard = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [ChannelService])
], ChannelMemberGuard);
export { ChannelMemberGuard };
