var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module.js';
import { AuthModule } from './auth/auth.module.js';
import { UserModule } from './user/user.module.js';
import { UserGameModule } from './user_game/user_game.module.js';
import { GameModule } from './game/game.module.js';
import { ChatModule } from './chat/chat.module.js';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { ChannelModule } from './channel/channel.module.js';
let AppModule = class AppModule {
};
AppModule = __decorate([
    Module({
        imports: [
            JwtModule.register({
                secret: process.env.jwtSecret,
            }),
            AuthModule,
            PrismaModule,
            UserModule,
            UserGameModule,
            ChatModule,
            ConfigModule,
            GameModule,
            ChannelModule
        ]
    })
], AppModule);
export { AppModule };
