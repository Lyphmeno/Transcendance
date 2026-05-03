import { player } from './game/game.gateway.js';
import { UserSocketsService } from './chat/chat.userSocketsService.js';
export declare let players: {
    [id: string]: player;
};
export declare let socketService: UserSocketsService;
