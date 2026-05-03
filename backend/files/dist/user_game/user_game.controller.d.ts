import { UserGameService } from "./user_game.service.js";
import { Game } from "@prisma/client";
import { CreateGameDto } from "./dto/create-game.dto.js";
export declare class UserGameController {
    private userGameService;
    constructor(userGameService: UserGameService);
    getAll(): Promise<Game[]>;
    getAllCount(): Promise<number>;
    getAllLatestGames(first: number, last: number): Promise<Game[]>;
    getOwnGames(req: any): Promise<Game[]>;
    getOwnGamesCount(req: any): Promise<number>;
    getOwnLatestGames(req: any, first: number, last: number): Promise<Game[]>;
    getOwnGamesVS(id: number, req: any): Promise<Game[]>;
    getVictories(req: any): Promise<Game[]>;
    getVictoriesCount(req: any): Promise<number>;
    getGamesByID(id: number): Promise<Game[]>;
    getGamesCountByID(id: number): Promise<number>;
    getLatestGamesByID(id: number, first: number, last: number): Promise<Game[]>;
    getVSGamesByID(id1: number, id2: number): Promise<Game[]>;
    getVictoriesByID(id: number): Promise<Game[]>;
    getVictoriesCountByID(id: number): Promise<number>;
    createGame(createGameDto: CreateGameDto): Promise<Game>;
}
