var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service.js";
let UserGameService = class UserGameService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll() {
        const games = this.prisma.game.findMany({});
        return games;
    }
    async findAllByOnePlayer(id) {
        const games = await this.prisma.game.findMany({
            where: {
                OR: [
                    {
                        player1: Number(id),
                    },
                    {
                        player2: Number(id),
                    },
                ],
            },
            orderBy: {
                timeStart: "desc",
            },
        });
        return games;
    }
    async findAllByTwoPlayers(id1, id2) {
        const games = await this.prisma.game.findMany({
            where: {
                OR: [
                    {
                        player1: id1,
                        player2: id2,
                    },
                    {
                        player1: id2,
                        player2: id1,
                    },
                ],
            },
            orderBy: {
                timeStart: "desc",
            },
        });
        return games;
    }
    async findAllByWinner(id) {
        const games = await this.prisma.game.findMany({
            where: {
                winner: Number(id),
            },
            orderBy: {
                timeStart: "desc",
            },
        });
        return games;
    }
    async findManyOrderedByDate(first, last) {
        const skip = first - 1;
        const take = last - first + 1;
        const games = await this.prisma.game.findMany({
            orderBy: {
                timeStart: "desc",
            },
            skip,
            take,
        });
        return games;
    }
    async findManyByUserOrderedByDate(id, first, last) {
        const skip = first - 1;
        const take = last - first + 1;
        const games = await this.prisma.game.findMany({
            where: {
                id,
            },
            orderBy: {
                timeStart: "desc",
            },
            skip,
            take,
        });
        return games;
    }
    async createOne(createGameDto) {
        const { player1, player2, timeStart, timeEnd, winner } = createGameDto;
        const game = await this.prisma.game.create({
            data: {
                player1Ref: {
                    connect: {
                        id: player1,
                    },
                },
                player2Ref: {
                    connect: {
                        id: player2,
                    },
                },
                timeStart,
                timeEnd,
                winnerRef: {
                    connect: {
                        id: winner,
                    },
                },
            },
        });
        return game;
    }
    async countByWinner(id) {
        const gamesCount = await this.prisma.game.count({
            where: {
                winner: Number(id),
            },
        });
        return gamesCount;
    }
    async countByPlayer(id) {
        const gamesCount = await this.prisma.game.count({
            where: {
                OR: [
                    {
                        player1: Number(id),
                    },
                    {
                        player2: Number(id),
                    },
                ],
            },
        });
        return gamesCount;
    }
    async countAll() {
        const gamesCount = await this.prisma.game.count({});
        return gamesCount;
    }
};
UserGameService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService])
], UserGameService);
export { UserGameService };
