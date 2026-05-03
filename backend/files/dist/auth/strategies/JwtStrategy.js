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
var JwtStrategy_1;
import { Injectable, Req, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
let JwtStrategy = JwtStrategy_1 = class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                JwtStrategy_1.extractJWTFromCookie,
            ]),
            ignoreExpiration: false,
            secretOrKey: process.env.jwtSecret,
        });
    }
    static extractJWTFromCookie(req) {
        if (req.cookies && req.cookies.access_token) {
            return req.cookies.access_token;
        }
        return null;
    }
    async validate(payload) {
        if (payload.is2FAEnabled && !payload.is2FAAuthenticated) {
            throw new UnauthorizedException('require second authentication step');
        }
        return {
            id: payload.id,
        };
    }
};
__decorate([
    __param(0, Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", String)
], JwtStrategy, "extractJWTFromCookie", null);
JwtStrategy = JwtStrategy_1 = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [])
], JwtStrategy);
export { JwtStrategy };
