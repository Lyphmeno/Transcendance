/// <reference types="node" />
import { Worker } from 'worker_threads';
import { Server, Socket } from 'socket.io';
import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { ChatService } from '../chat/service/index.js';
import { UserService } from '../user/user.service.js';
import { UserGameService } from '../user_game/user_game.service.js';
type Size = {
    width: number;
    height: number;
};
type Coordinates = {
    x: number;
    y: number;
};
type Side = 'left' | 'right';
type Direction = 'up' | 'down' | 'left' | 'right' | 'none';
type GameState = 'init' | 'ready' | 'created' | 'started' | 'stopped' | 'ended';
type workerMessage = newPropsFromWorker | GameState | GameEvent | playerLife | PlayerAchievements;
declare const gameEvent: readonly ["goal", "3", "2", "1", "fight", "blocked", "stop", "noHit"];
type GameEvent = (typeof gameEvent)[number];
interface keyStates {
    up: boolean;
    down: boolean;
    left: boolean;
    right: boolean;
}
export interface player {
    socket: Socket;
    id: string;
    userId: number;
    nickname: string;
    workerId: string | undefined;
    character: string;
    state: string;
    isBot?: boolean;
}
interface playerLife {
    left: number;
    right: number;
}
interface AchievementsTabs {
    left: boolean[];
    right: boolean[];
}
interface PlayerAchievements {
    leftAchiv: Achievement;
    rightAchiv: Achievement;
}
interface Achievement {
    wasNotHit: boolean;
    hasNotHit: boolean;
    asGarrick: boolean;
    asBoreas: boolean;
    asHelios: boolean;
    asOrion: boolean;
    asFaeleen: boolean;
    asThorian: boolean;
}
interface party {
    id: string;
    worker: Worker | undefined;
    workerState: GameState | undefined;
    leftPlayer: player | undefined;
    rightPlayer: player | undefined;
    startTime: string;
    remainingPlayers: number;
    isSolo?: boolean;
}
interface playerConstructToWorker {
    side: Side;
    coords: Coordinates;
    size: Size;
    character: string;
}
interface newPropsFromWorker {
    workerId: string;
    leftProps: Coordinates;
    rightProps: Coordinates;
    ballProps: Coordinates;
}
interface newPropsFromClient {
    keys: keyStates;
    dir: Direction | undefined;
}
export declare class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private userService;
    private userGameService;
    private chatService;
    constructor(userService: UserService, userGameService: UserGameService, chatService: ChatService);
    server: Server;
    private readonly screenHeight;
    private readonly screenWidth;
    private readonly privateRequests;
    private matchQueue;
    private parties;
    wait(milliseconds: number): Promise<unknown>;
    isNewProps(payload: workerMessage): payload is newPropsFromWorker;
    isGameEvent(payload: any): payload is GameEvent;
    isLifeUpdate(payload: workerMessage): payload is playerLife;
    isAchievements(payload: workerMessage): payload is PlayerAchievements;
    newWorkerConstruct(characterName: string, side: Side): playerConstructToWorker;
    createWorkerConstructs(newParty: party): void;
    getAchievements(payload: PlayerAchievements): AchievementsTabs;
    createWorker(newParty: party): void;
    createParty(leftPlayer: player, rightPlayer: player, isSolo?: boolean): Promise<void>;
    sendOpponents(leftPlayer: player, rightPlayer: player): Promise<void>;
    sendSoloOpponent(leftPlayer: player, rightPlayer: player): Promise<void>;
    getBotCharacter(excludeCharacter: string): string;
    createBotPlayer(humanPlayer: player): player;
    startPrivateGame(p1Socket: Socket, p2Socket: Socket): void;
    handleSolo(socket: Socket): Promise<void>;
    checkMatchQueue(): void;
    createWebConstructs(party: party): void;
    sendPartyEnd(winner: player, party: party): Promise<void>;
    playerIsDead(winner: player | undefined, party: party): Promise<void>;
    endWorker(party: party): Promise<void>;
    handleConnection(socket: Socket, ...args: any[]): Promise<void>;
    handlePrivate(p1Socket: Socket, p2UserId: number): Promise<void>;
    handleMatchmaking(socket: Socket): void;
    handleStopMatchmaking(socket: Socket): void;
    handlePlayerKeyUpdate(socket: Socket, payload: newPropsFromClient): void;
    handlePlayerStateUpdate(socket: Socket, payload: GameState): void;
    handleDisconnect(socket: Socket): Promise<void>;
}
export {};
