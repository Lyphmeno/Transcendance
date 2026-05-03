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
import { Controller, Get, UseGuards, Req, Post, Body, Res, UseFilters, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { FortyTwoAuthGuard } from './guards/FortyTwoGuard.js';
import { UserService } from '../user/user.service.js';
import { CallbackExceptionFilter } from './filter/callback-exception.filter.js';
import { JwtGuard } from './guards/JwtGuard.js';
import { authenticator } from 'otplib';
import { toFileStream } from 'qrcode';
import { JwtTwoFactorGuard } from './guards/JwtTwoFactorGuard.js';
let AuthController = class AuthController {
    authService;
    userService;
    hostIp = process.env.HOST_IP;
    constructor(authService, userService) {
        this.authService = authService;
        this.userService = userService;
    }
    handle42Loging() { }
    async handle42Redirect(req, res) {
        const access_token = await this.authService.login(req.user, false);
        res.cookie('access_token', access_token, {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24 * 7,
            sameSite: 'lax',
        });
        res.redirect('http://' + this.hostIp + ':8080');
    }
    logout(req, res) {
        res.clearCookie('access_token', {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24 * 7,
            sameSite: 'lax',
        });
        return (req.user);
    }
    async activate2FA(req) {
        const user = await this.userService.update2FAStatus(req.user.id, true);
        return user;
    }
    async deactivate2FA(req) {
        const user = await this.userService.update2FAStatus(req.user.id, false);
        return user;
    }
    async addNewSecret(req) {
        const secret = authenticator.generateSecret();
        const user = await this.userService.update2FASecret(req.user.id, secret);
        return user;
    }
    async getSecretStatus(req) {
        const user = await this.userService.findOneFullById(req.user.id);
        if (user.twoFactorAuthSecret) {
            return true;
        }
        return false;
    }
    async generateQRCode(req, res) {
        const user = await this.userService.findOneByIdOrThrow(req.user.id);
        if (!user.twoFactorAuthSecret) {
            throw new BadRequestException('generate a secret first');
        }
        const otpauthURL = authenticator.keyuri(user.email, 'transcendance', user.twoFactorAuthSecret);
        return toFileStream(res, otpauthURL);
    }
    async verify2FACode(req, res, code) {
        const user = await this.userService.findOneByIdOrThrow(req.user.id);
        const isValid = authenticator.verify({
            token: code,
            secret: user.twoFactorAuthSecret,
        });
        if (!isValid) {
            throw new UnauthorizedException('wrong authenticator code');
        }
        const access_token = await this.authService.login(user, true);
        res.cookie('access_token', access_token, {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24 * 7,
            sameSite: 'lax',
        });
    }
};
__decorate([
    Get('42/login'),
    UseGuards(FortyTwoAuthGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "handle42Loging", null);
__decorate([
    Get('42/callback'),
    UseGuards(FortyTwoAuthGuard),
    UseFilters(CallbackExceptionFilter),
    __param(0, Req()),
    __param(1, Res({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "handle42Redirect", null);
__decorate([
    Get('logout'),
    UseGuards(JwtGuard),
    __param(0, Req()),
    __param(1, Res({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Object)
], AuthController.prototype, "logout", null);
__decorate([
    Post('2FA/on'),
    UseGuards(JwtGuard),
    __param(0, Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "activate2FA", null);
__decorate([
    Post('2FA/off'),
    UseGuards(JwtGuard),
    __param(0, Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "deactivate2FA", null);
__decorate([
    Post('2FA/secret/new'),
    UseGuards(JwtGuard),
    __param(0, Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "addNewSecret", null);
__decorate([
    Get('2FA/secret'),
    UseGuards(JwtGuard),
    __param(0, Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getSecretStatus", null);
__decorate([
    Get('2FA/qrcode'),
    UseGuards(JwtGuard),
    __param(0, Req()),
    __param(1, Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "generateQRCode", null);
__decorate([
    Post('2FA/verify'),
    UseGuards(JwtTwoFactorGuard),
    __param(0, Req()),
    __param(1, Res({ passthrough: true })),
    __param(2, Body('code')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "verify2FACode", null);
AuthController = __decorate([
    Controller('auth'),
    __metadata("design:paramtypes", [AuthService,
        UserService])
], AuthController);
export { AuthController };
