var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Module } from '@nestjs/common';
import { ChatService } from './service/index.js';
import { UserModule } from '../user/user.module.js';
import { ChatGateway } from './chat.gateway.js';
import { AuthService } from '../auth/auth.service.js';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { UserSocketsService } from './chat.userSocketsService.js';
import { ChatController } from './chat.controller.js';
import { PrismaService } from 'nestjs-prisma';
let ChatModule = class ChatModule {
};
ChatModule = __decorate([
    Module({
        imports: [
            JwtModule.register({
                secret: process.env.jwtSecret,
            }),
            UserModule,
            ConfigModule
        ],
        providers: [
            ChatService,
            ChatGateway,
            AuthService,
            UserSocketsService,
            PrismaService
        ],
        controllers: [
            ChatController
        ],
        exports: [
            ChatService,
            UserSocketsService
        ]
    })
], ChatModule);
export { ChatModule };
