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
import { PrismaService } from 'nestjs-prisma';
let UserService = class UserService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findOneById(id) {
        const user = await this.prisma.user.findUnique({
            where: { id },
        });
        return user;
    }
    async findOneFullById(id) {
        const user = await this.prisma.user.findUnique({
            where: { id },
        });
        return user;
    }
    async findOneByIdOrThrow(id) {
        const user = await this.prisma.user.findUniqueOrThrow({
            where: { id },
        });
        return user;
    }
    async findOneByEmail(email) {
        const user = await this.prisma.user.findUnique({
            where: { email },
        });
        return user;
    }
    async findOrCreateOne42(email, nickname) {
        let user = await this.findOneByEmail(email);
        if (user) {
            return user;
        }
        user = await this.createOne({
            email,
            nickname,
        });
        return user;
    }
    async findOrCreateOne(email) {
        let user = await this.findOneByEmail(email);
        if (user) {
            return user;
        }
        const nickname = this.generateFunnyNickname();
        user = await this.createOne({
            email,
            nickname,
        });
        return user;
    }
    async findAll() {
        const users = await this.prisma.user.findMany({});
        return users;
    }
    async findManyByRankDec(count) {
        const users = await this.prisma.user.findMany({
            orderBy: {
                rankPoints: "desc",
            },
            take: count,
        });
        return users;
    }
    async createOne(userCreateInput) {
        const user = await this.prisma.user.create({
            data: userCreateInput,
        });
        return user;
    }
    async deleteOneById(id) {
        const user = await this.prisma.user.delete({
            where: { id },
        });
        return user;
    }
    async updateNickname(id, nickname) {
        const user = await this.prisma.user.update({
            where: { id },
            data: {
                nickname,
            },
        });
        return user;
    }
    async updateStory(id, story) {
        const user = await this.prisma.user.update({
            where: { id },
            data: {
                story,
            },
        });
        return user;
    }
    async updateAvatar(id, filename) {
        const user = await this.prisma.user.update({
            where: { id },
            data: {
                avatarFilename: filename,
            },
        });
        return user;
    }
    async updateRank(id, pts) {
        const user = await this.prisma.user.findUnique({
            where: {
                id,
            },
        });
        let sameUser;
        if (pts > 0 || (pts < 0 && user.rankPoints >= pts * -1)) {
            sameUser = await this.prisma.user.update({
                where: { id },
                data: { rankPoints: { increment: pts } },
            });
        }
        else {
            sameUser = await this.prisma.user.update({
                where: { id },
                data: { rankPoints: 0 },
            });
        }
        return sameUser;
    }
    async updateSelected(id, character) {
        const user = await this.prisma.user.update({
            where: {
                id
            },
            data: {
                character: character
            },
        });
        return user;
    }
    async update2FAStatus(id, status) {
        const user = await this.prisma.user.update({
            where: {
                id,
            },
            data: {
                twoFactorAuthStatus: status,
            },
        });
        return user;
    }
    async update2FASecret(id, secret) {
        const user = await this.prisma.user.update({
            where: {
                id,
            },
            data: {
                twoFactorAuthSecret: secret,
            },
        });
        return user;
    }
    async createAchievement(userId, achievId) {
        let achievement = await this.prisma.achievement.findUnique({
            where: {
                userId_achievId: {
                    userId: userId,
                    achievId: achievId,
                },
            },
        });
        if (!achievement) {
            achievement = await this.prisma.achievement.create({
                data: {
                    userId,
                    achievId,
                },
            });
        }
        return achievement;
    }
    async getAchievements(userId) {
        const achievements = await this.prisma.achievement.findMany({
            where: {
                userId: userId
            },
        });
        return achievements;
    }
    generateFunnyNickname() {
        const adjectives = ['happy', 'silly', 'goofy', 'wacky', 'zany', 'quirky', 'bouncy', 'spunky', 'jolly', 'nutty'];
        const nouns = ['banana', 'muffin', 'pickle', 'noodle', 'butterfly', 'cupcake', 'dinosaur', 'penguin', 'unicorn', 'octopus'];
        const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
        const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
        const randomNum = Math.floor(Math.random() * 100);
        return `${randomAdjective}-${randomNoun}-${randomNum}`;
    }
};
UserService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService])
], UserService);
export { UserService };
