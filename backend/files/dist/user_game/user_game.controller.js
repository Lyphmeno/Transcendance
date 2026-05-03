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
import { Body, Controller, Get, Param, ParseIntPipe, Post, Req, UseGuards } from "@nestjs/common";
import { UserGameService } from "./user_game.service.js";
import { JwtGuard } from "../auth/guards/JwtGuard.js";
import { CreateGameDto } from "./dto/create-game.dto.js";
let UserGameController = class UserGameController {
    userGameService;
    constructor(userGameService) {
        this.userGameService = userGameService;
    }
    async getAll() {
        return this.userGameService.findAll();
    }
    async getAllCount() {
        return this.userGameService.countAll();
    }
    async getAllLatestGames(first, last) {
        return this.userGameService.findManyOrderedByDate(first, last);
    }
    async getOwnGames(req) {
        return this.userGameService.findAllByOnePlayer(req.user.id);
    }
    async getOwnGamesCount(req) {
        return this.userGameService.countByPlayer(req.user.id);
    }
    async getOwnLatestGames(req, first, last) {
        return this.userGameService.findManyByUserOrderedByDate(req.user.id, first, last);
    }
    async getOwnGamesVS(id, req) {
        return this.userGameService.findAllByTwoPlayers(req.user.id, id);
    }
    async getVictories(req) {
        return this.userGameService.findAllByWinner(req.user.id);
    }
    async getVictoriesCount(req) {
        return this.userGameService.countByWinner(req.user.id);
    }
    async getGamesByID(id) {
        return this.userGameService.findAllByOnePlayer(id);
    }
    async getGamesCountByID(id) {
        return this.userGameService.countByPlayer(id);
    }
    async getLatestGamesByID(id, first, last) {
        return this.userGameService.findManyByUserOrderedByDate(id, first, last);
    }
    async getVSGamesByID(id1, id2) {
        return this.userGameService.findAllByTwoPlayers(id1, id2);
    }
    async getVictoriesByID(id) {
        return this.userGameService.findAllByWinner(id);
    }
    async getVictoriesCountByID(id) {
        return this.userGameService.countByWinner(id);
    }
    async createGame(createGameDto) {
        console.log(createGameDto);
        return this.userGameService.createOne(createGameDto);
    }
};
__decorate([
    Get('all'),
    UseGuards(JwtGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserGameController.prototype, "getAll", null);
__decorate([
    Get('all/count'),
    UseGuards(JwtGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserGameController.prototype, "getAllCount", null);
__decorate([
    Get('all/latest/:first/:last'),
    UseGuards(JwtGuard),
    __param(0, Param('first', ParseIntPipe)),
    __param(1, Param('last', ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], UserGameController.prototype, "getAllLatestGames", null);
__decorate([
    Get('own'),
    UseGuards(JwtGuard),
    __param(0, Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserGameController.prototype, "getOwnGames", null);
__decorate([
    Get('own/count'),
    UseGuards(JwtGuard),
    __param(0, Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserGameController.prototype, "getOwnGamesCount", null);
__decorate([
    Get('own/latest/:first/:last'),
    UseGuards(JwtGuard),
    __param(0, Req()),
    __param(1, Param('first')),
    __param(2, Param('last')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Number]),
    __metadata("design:returntype", Promise)
], UserGameController.prototype, "getOwnLatestGames", null);
__decorate([
    Get('own/vs/:id'),
    UseGuards(JwtGuard),
    __param(0, Param('id', ParseIntPipe)),
    __param(1, Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], UserGameController.prototype, "getOwnGamesVS", null);
__decorate([
    Get('own/victories'),
    UseGuards(JwtGuard),
    __param(0, Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserGameController.prototype, "getVictories", null);
__decorate([
    Get('own/victories/count'),
    UseGuards(JwtGuard),
    __param(0, Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserGameController.prototype, "getVictoriesCount", null);
__decorate([
    Get(':id'),
    UseGuards(JwtGuard),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], UserGameController.prototype, "getGamesByID", null);
__decorate([
    Get(':id/count'),
    UseGuards(JwtGuard),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], UserGameController.prototype, "getGamesCountByID", null);
__decorate([
    Get(':id/latest/:first/:last'),
    UseGuards(JwtGuard),
    __param(0, Param('id')),
    __param(1, Param('first')),
    __param(2, Param('last')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Number]),
    __metadata("design:returntype", Promise)
], UserGameController.prototype, "getLatestGamesByID", null);
__decorate([
    Get(':id1/vs/:id2'),
    UseGuards(JwtGuard),
    __param(0, Param('id1', ParseIntPipe)),
    __param(1, Param('id2')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], UserGameController.prototype, "getVSGamesByID", null);
__decorate([
    Get(':id/victories'),
    UseGuards(JwtGuard),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], UserGameController.prototype, "getVictoriesByID", null);
__decorate([
    Get(':id/victories/count'),
    UseGuards(JwtGuard),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], UserGameController.prototype, "getVictoriesCountByID", null);
__decorate([
    Post('new'),
    UseGuards(JwtGuard),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateGameDto]),
    __metadata("design:returntype", Promise)
], UserGameController.prototype, "createGame", null);
UserGameController = __decorate([
    Controller('games'),
    __metadata("design:paramtypes", [UserGameService])
], UserGameController);
export { UserGameController };
