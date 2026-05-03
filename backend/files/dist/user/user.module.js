var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Module } from '@nestjs/common';
import { UserService } from './user.service.js';
import { UserController } from './user.controller.js';
import { PrismaModule } from 'nestjs-prisma';
import { MulterModule } from '@nestjs/platform-express';
import { FriendModule } from '../friend/friend.module.js';
let UserModule = class UserModule {
};
UserModule = __decorate([
    Module({
        providers: [UserService],
        controllers: [UserController],
        imports: [
            PrismaModule,
            MulterModule,
            FriendModule,
        ],
        exports: [UserService],
    })
], UserModule);
export { UserModule };
