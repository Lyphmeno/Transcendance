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
import { BadRequestException, Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Req, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { UserService } from "./user.service.js";
import { JwtGuard } from "../auth/guards/JwtGuard.js";
import { FileInterceptor } from "@nestjs/platform-express";
import * as fs from 'fs';
import { diskStorage } from "multer";
import { FriendRequestService } from "../friend/friend.service.js";
import { promisify } from "util";
let UserController = class UserController {
    userService;
    friendRequestService;
    constructor(userService, friendRequestService) {
        this.userService = userService;
        this.friendRequestService = friendRequestService;
    }
    IsConnected(req) {
        return this.userService.findOneByIdOrThrow(req.user.id);
    }
    async getAll() {
        return this.userService.findAll();
    }
    async changeNickname(req, nickname) {
        console.log('body:', req.body);
        console.log('name:', nickname);
        return this.userService.updateNickname(req.user.id, nickname);
    }
    async changeStory(req, story) {
        return this.userService.updateStory(req.user.id, story);
    }
    async newAchievement(req, achievId) {
        if (achievId < 0 || achievId > 7) {
            throw new BadRequestException('the achievement ID must be between 0 and 7 included');
        }
        return this.userService.createAchievement(req.user.id, achievId);
    }
    async uploadAvatar(file, req) {
        if (!file) {
            throw new BadRequestException('can only upload jpeg files');
        }
        const user = await this.userService.findOneByIdOrThrow(req.user.id);
        const unlinkAsync = promisify(fs.unlink);
        if (user.avatarFilename !== 'default.jpg') {
            const path = 'upload/avatars/' + user.avatarFilename;
            try {
                await unlinkAsync(path);
                console.log(path + ' was deleted');
            }
            catch (err) {
                console.log('could not delete ' + path);
            }
        }
        return this.userService.updateAvatar(req.user.id, file.filename);
    }
    async deleteOneUser(req) {
        return this.userService.deleteOneById(req.user.id);
    }
    async getSelf(req) {
        return this.userService.findOneById(req.user.id);
    }
    async selectCharacter(req, character) {
        return this.userService.updateSelected(req.user.id, character);
    }
    async getOneById(id) {
        return this.userService.findOneById(id);
    }
    async getUserAchievements(id) {
        return this.userService.getAchievements(id);
    }
    async getTopPlayers(count) {
        return this.userService.findManyByRankDec(count);
    }
    async modifyRank(req, pts) {
        return this.userService.updateRank(req.user.id, pts);
    }
    async getOwnFriendsIDs(req) {
        return this.friendRequestService.findAllFriends(req.user.id);
    }
    async getFriendsRequestsSent(req) {
        return this.friendRequestService.findAllRequestsSent(req.user.id);
    }
    async getFriendsRequestsReceived(req) {
        return this.friendRequestService.findAllRequestsReceived(req.user.id);
    }
    async addFriend(req, friendID) {
        return this.friendRequestService.createOne(req.user.id, friendID);
    }
    async deleteFriend(req, friendID) {
        return this.friendRequestService.deleteOne(req.user.id, friendID);
    }
};
__decorate([
    Get('connected'),
    UseGuards(JwtGuard),
    __param(0, Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "IsConnected", null);
__decorate([
    Get('all'),
    UseGuards(JwtGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getAll", null);
__decorate([
    Post('me/nickname'),
    UseGuards(JwtGuard),
    __param(0, Req()),
    __param(1, Body('nickname')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "changeNickname", null);
__decorate([
    Post('me/story'),
    UseGuards(JwtGuard),
    __param(0, Req()),
    __param(1, Body('story')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "changeStory", null);
__decorate([
    Post('me/achievements/:id'),
    UseGuards(JwtGuard),
    __param(0, Req()),
    __param(1, Param('id', ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "newAchievement", null);
__decorate([
    Post('me/avatar/upload'),
    UseGuards(JwtGuard),
    UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: (req, file, cb) => {
                cb(null, 'upload/avatars');
            },
            filename: (req, file, cb) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9) + '.jpg';
                cb(null, file.fieldname + '-' + uniqueSuffix);
            },
        }),
        limits: {
            fieldSize: 2097152,
        },
        fileFilter: (req, file, cb) => {
            if (file.mimetype === 'image/jpeg') {
                cb(null, true);
            }
            else {
                cb(null, false);
            }
        },
    })),
    __param(0, UploadedFile()),
    __param(1, Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "uploadAvatar", null);
__decorate([
    Delete('me'),
    UseGuards(JwtGuard),
    __param(0, Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "deleteOneUser", null);
__decorate([
    Get('self'),
    UseGuards(JwtGuard),
    __param(0, Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getSelf", null);
__decorate([
    Get('select/:name'),
    UseGuards(JwtGuard),
    __param(0, Req()),
    __param(1, Param('name')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "selectCharacter", null);
__decorate([
    Get(':id'),
    UseGuards(JwtGuard),
    __param(0, Param('id', ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getOneById", null);
__decorate([
    Get(':id/achievements'),
    UseGuards(JwtGuard),
    __param(0, Param('id', ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getUserAchievements", null);
__decorate([
    Get('rank/top/:count'),
    UseGuards(JwtGuard),
    __param(0, Param('count', ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getTopPlayers", null);
__decorate([
    Post('me/rank/:pts'),
    UseGuards(JwtGuard),
    __param(0, Req()),
    __param(1, Param('pts', ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "modifyRank", null);
__decorate([
    Get('me/friends'),
    UseGuards(JwtGuard),
    __param(0, Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getOwnFriendsIDs", null);
__decorate([
    Get('me/friends/requests/sent'),
    UseGuards(JwtGuard),
    __param(0, Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getFriendsRequestsSent", null);
__decorate([
    Get('me/friends/requests/received'),
    UseGuards(JwtGuard),
    __param(0, Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getFriendsRequestsReceived", null);
__decorate([
    Post('me/friends/:id'),
    UseGuards(JwtGuard),
    __param(0, Req()),
    __param(1, Param('id', ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "addFriend", null);
__decorate([
    Delete('me/friends/:id'),
    UseGuards(JwtGuard),
    __param(0, Req()),
    __param(1, Param('id', ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "deleteFriend", null);
UserController = __decorate([
    Controller('users'),
    __metadata("design:paramtypes", [UserService,
        FriendRequestService])
], UserController);
export { UserController };
