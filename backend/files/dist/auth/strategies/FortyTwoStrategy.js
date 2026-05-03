var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Strategy } from 'passport-42';
import { UserService } from '../../user/user.service.js';
let FortyTwoStrategy = class FortyTwoStrategy extends PassportStrategy(Strategy) {
    userService;
    constructor(userService) {
        super({
            clientID: process.env.FortyTwoClientID,
            clientSecret: process.env.FortyTwoSecret,
            callbackURL: process.env.FortyTwoCallBackURL
        });
        this.userService = userService;
    }
    async validate(accessToken, refreshToken, profile, done) {
        const user = await this.userService.findOrCreateOne42(profile.emails[0].value, profile.username);
        console.log(user);
        return user;
    }
};
FortyTwoStrategy = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [UserService])
], FortyTwoStrategy);
export { FortyTwoStrategy };
