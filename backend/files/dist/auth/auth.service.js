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
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service.js';
let AuthService = class AuthService {
    jwtService;
    userService;
    constructor(jwtService, userService) {
        this.jwtService = jwtService;
        this.userService = userService;
    }
    async login(user, is2FAAuthenticated) {
        const payload = {
            id: user.id,
            is2FAEnabled: user.twoFactorAuthStatus,
            is2FAAuthenticated,
        };
        return this.jwtService.sign(payload);
    }
    async getUserfromAuthenticationToken(token) {
        if (!token)
            return;
        const payload = this.jwtService.verify(token, {
            secret: process.env.jwtSecret
        });
        if (payload.id) {
            const userReturned = await this.userService.findOneById(payload.id);
            return userReturned;
        }
    }
};
AuthService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [JwtService,
        UserService])
], AuthService);
export { AuthService };
