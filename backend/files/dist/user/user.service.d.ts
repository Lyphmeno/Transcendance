import { PrismaService } from 'nestjs-prisma';
import { Prisma, User, Achievement } from '@prisma/client';
export type Character = 'Boreas' | 'Helios' | 'Selene' | 'Liliana' | 'Orion' | 'Faeleen' | 'Rylan' | 'Garrick' | 'Thorian';
export declare class UserService {
    private prisma;
    constructor(prisma: PrismaService);
    findOneById(id: number): Promise<User | null>;
    findOneFullById(id: number): Promise<User | null>;
    findOneByIdOrThrow(id: number): Promise<User | null>;
    findOneByEmail(email: string): Promise<User | null>;
    findOrCreateOne42(email: string, nickname: string): Promise<User>;
    findOrCreateOne(email: string): Promise<User>;
    findAll(): Promise<User[] | null>;
    findManyByRankDec(count: number): Promise<User[]>;
    createOne(userCreateInput: Prisma.UserCreateInput): Promise<User>;
    deleteOneById(id: number): Promise<User>;
    updateNickname(id: number, nickname: string): Promise<User>;
    updateStory(id: number, story: string): Promise<User>;
    updateAvatar(id: number, filename: string): Promise<User>;
    updateRank(id: number, pts: number): Promise<User>;
    updateSelected(id: number, character: Character): Promise<User>;
    update2FAStatus(id: number, status: boolean): Promise<User>;
    update2FASecret(id: number, secret: string): Promise<User>;
    createAchievement(userId: number, achievId: number): Promise<Achievement>;
    getAchievements(userId: number): Promise<Achievement[]>;
    generateFunnyNickname(): string;
}
