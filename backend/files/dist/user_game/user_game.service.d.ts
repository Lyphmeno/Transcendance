import { Game } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service.js";
import { CreateGameDto } from "./dto/create-game.dto.js";
export declare class UserGameService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<Game[]>;
    findAllByOnePlayer(id: number): Promise<Game[]>;
    findAllByTwoPlayers(id1: number, id2: number): Promise<Game[]>;
    findAllByWinner(id: number): Promise<Game[]>;
    findManyOrderedByDate(first: number, last: number): Promise<Game[]>;
    findManyByUserOrderedByDate(id: number, first: number, last: number): Promise<Game[]>;
    createOne(createGameDto: CreateGameDto): Promise<Game>;
    countByWinner(id: number): Promise<number>;
    countByPlayer(id: number): Promise<number>;
    countAll(): Promise<number>;
}
