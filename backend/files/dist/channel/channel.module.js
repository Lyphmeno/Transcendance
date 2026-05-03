var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Module } from "@nestjs/common";
import { ChannelService } from "./channel.service.js";
import { ChannelController } from "./channel.controller.js";
import { PrismaModule } from "../prisma/prisma.module.js";
import { PrismaService } from "../prisma/prisma.service.js";
import { ChannelMemberGuard } from "./channel-message.guard.js";
let ChannelModule = class ChannelModule {
};
ChannelModule = __decorate([
    Module({
        controllers: [ChannelController],
        providers: [ChannelService, ChannelMemberGuard, PrismaService],
        imports: [PrismaModule],
    })
], ChannelModule);
export { ChannelModule };
