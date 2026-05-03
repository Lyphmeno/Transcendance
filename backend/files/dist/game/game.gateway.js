var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { v4 as uuidv4 } from 'uuid';
import { Worker } from 'worker_threads';
import { Server, Socket } from 'socket.io';
import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { ChatService } from '../chat/service/index.js';
import { UserService } from '../user/user.service.js';
import { UserGameService } from '../user_game/user_game.service.js';
import Characters from '../characters.json' assert { type: 'json' };
import { players, socketService } from '../main.js';
const gameEvent = ['goal', '3', '2', '1', 'fight', 'blocked', 'stop', 'noHit'];
let GameGateway = class GameGateway {
    userService;
    userGameService;
    chatService;
    constructor(userService, userGameService, chatService) {
        this.userService = userService;
        this.userGameService = userGameService;
        this.chatService = chatService;
    }
    server;
    screenHeight = 1080;
    screenWidth = 1920;
    privateRequests = new Map();
    matchQueue = [];
    parties = {};
    wait(milliseconds) {
        return new Promise(resolve => setTimeout(resolve, milliseconds));
    }
    isNewProps(payload) {
        return payload.ballProps !== undefined;
    }
    isGameEvent(payload) {
        return gameEvent.includes(payload);
    }
    ;
    isLifeUpdate(payload) {
        return payload.left !== undefined;
    }
    isAchievements(payload) {
        return payload.leftAchiv !== undefined;
    }
    newWorkerConstruct(characterName, side) {
        let character = Characters[characterName];
        return {
            side: side,
            coords: {
                x: (side === 'left' ? 250 - character.size.width / 2 : this.screenWidth - 250 - character.size.width / 2),
                y: (this.screenHeight / 2 - character.size.height / 2),
            },
            size: { width: character.size.width, height: character.size.height },
            character: characterName
        };
    }
    createWorkerConstructs(newParty) {
        if (newParty.leftPlayer && newParty.rightPlayer) {
            newParty.worker?.postMessage(this.newWorkerConstruct(newParty.leftPlayer.character, 'left'));
            newParty.worker?.postMessage(this.newWorkerConstruct(newParty.rightPlayer.character, 'right'));
        }
    }
    getAchievements(payload) {
        console.log("Achievements:", payload);
        let achievements = {
            left: [],
            right: [],
        };
        let i = 0;
        for (let achievement in payload.leftAchiv) {
            achievements.left[i] = payload.leftAchiv[achievement];
            i++;
        }
        i = 0;
        for (let achievement in payload.rightAchiv) {
            achievements.right[i] = payload.rightAchiv[achievement];
            i++;
        }
        return achievements;
    }
    createWorker(newParty) {
        newParty.worker?.on('message', (payload) => {
            if (this.isNewProps(payload)) {
                let outgoingProps = {
                    leftProps: payload.leftProps,
                    rightProps: payload.rightProps,
                    ballProps: payload.ballProps
                };
                newParty.leftPlayer?.socket?.emit('newProps', outgoingProps);
                newParty.rightPlayer?.socket?.emit('newProps', outgoingProps);
            }
            else if (this.isLifeUpdate(payload)) {
                if (payload.left == 0 || payload.right == 0) {
                    this.playerIsDead((payload.left == 0 ? newParty.rightPlayer : newParty.leftPlayer), newParty);
                }
                let userUpdate = {
                    left: {
                        name: newParty.leftPlayer.nickname,
                        hp: payload.left
                    },
                    right: {
                        name: newParty.rightPlayer.nickname,
                        hp: payload.right
                    }
                };
                newParty.leftPlayer?.socket?.emit('lifeUpdate', userUpdate);
                newParty.rightPlayer?.socket?.emit('lifeUpdate', userUpdate);
            }
            else if (this.isGameEvent(payload)) {
                switch (payload) {
                    case ('stop'):
                        newParty.leftPlayer?.socket?.emit('eventOff');
                        newParty.rightPlayer?.socket?.emit('eventOff');
                        break;
                    default:
                        newParty.leftPlayer?.socket?.emit('eventOn', payload);
                        newParty.rightPlayer?.socket?.emit('eventOn', payload);
                }
            }
            else if (this.isAchievements(payload)) {
                let achievements = this.getAchievements(payload);
                let i = 0;
                for (let achievement of achievements.left) {
                    if (achievement) {
                        console.log("creating achivement", i, "for player", newParty.leftPlayer.userId);
                        this.userService.createAchievement(newParty.leftPlayer.userId, i);
                    }
                    i++;
                }
                i = 0;
                for (let achievement of achievements.right) {
                    if (achievement) {
                        console.log("creating achivement", i, "for player", newParty.rightPlayer.userId);
                        this.userService.createAchievement(newParty.rightPlayer.userId, i);
                    }
                    i++;
                }
                this.endWorker(newParty);
            }
            else {
                newParty.workerState = payload;
                if (newParty.workerState == 'init')
                    newParty.worker?.postMessage({ workerId: newParty.id });
                else if (newParty.workerState == 'ready')
                    this.createWorkerConstructs(newParty);
                else if (newParty.workerState == 'created' && newParty.leftPlayer.state == 'created' && newParty.rightPlayer.state == 'created')
                    newParty.worker?.postMessage({ newState: 'started' });
            }
        });
    }
    async createParty(leftPlayer, rightPlayer, isSolo = false) {
        let newParty = {
            id: uuidv4(),
            worker: new Worker('./dist/worker/worker.js'),
            workerState: undefined,
            leftPlayer: leftPlayer,
            rightPlayer: rightPlayer,
            startTime: Date(),
            remainingPlayers: 2,
            isSolo: isSolo
        };
        newParty.leftPlayer?.socket?.emit('matched');
        newParty.rightPlayer?.socket?.emit('matched');
        console.log("Launching worker [" + newParty.id.slice(0, 4) + "]");
        this.parties[newParty.id] = newParty;
        newParty.leftPlayer.workerId = newParty.id;
        newParty.rightPlayer.workerId = newParty.id;
        this.createWorker(newParty);
    }
    async sendOpponents(leftPlayer, rightPlayer) {
        if (leftPlayer.socket && rightPlayer.socket) {
            let leftUser = await this.chatService.getUserFromSocket(leftPlayer.socket);
            let rightUser = await this.chatService.getUserFromSocket(rightPlayer.socket);
            leftPlayer.socket.emit('opponent', rightUser);
            rightPlayer.socket.emit('opponent', leftUser);
        }
    }
    async sendSoloOpponent(leftPlayer, rightPlayer) {
        if (!leftPlayer.socket)
            return;
        let leftUser = await this.chatService.getUserFromSocket(leftPlayer.socket);
        leftPlayer.socket.emit('opponent', {
            id: 0,
            nickname: 'Bot',
            avatarFilename: leftUser?.avatarFilename ?? ''
        });
    }
    getBotCharacter(excludeCharacter) {
        const characterNames = Object.keys(Characters);
        for (let name of characterNames) {
            if (name !== excludeCharacter)
                return name;
        }
        return characterNames[0] ?? 'Boreas';
    }
    createBotPlayer(humanPlayer) {
        const botId = 'bot-' + uuidv4();
        const botSocket = {
            id: botId,
            emit: (_event, _payload) => { },
            disconnect: () => { }
        };
        return {
            socket: botSocket,
            id: botId,
            userId: -1,
            nickname: 'Bot',
            workerId: undefined,
            character: this.getBotCharacter(humanPlayer.character),
            state: 'ready',
            isBot: true
        };
    }
    startPrivateGame(p1Socket, p2Socket) {
        console.log("Trying to launch private game");
        let leftPlayerId = p1Socket.id;
        let rightPlayerId = p2Socket.id;
        setTimeout(() => {
            let leftPlayer = players[leftPlayerId];
            let rightPlayer = players[rightPlayerId];
            if (leftPlayer === undefined || rightPlayer === undefined) {
                console.log("One or more players are missing, disconnecting");
                p1Socket.disconnect();
                p2Socket.disconnect();
            }
            else {
                this.sendOpponents(leftPlayer, rightPlayer);
                this.createParty(leftPlayer, rightPlayer);
            }
        }, 1000);
    }
    async handleSolo(socket) {
        let humanPlayer = players[socket.id];
        if (!humanPlayer || humanPlayer.workerId)
            return;
        let botPlayer = this.createBotPlayer(humanPlayer);
        await this.sendSoloOpponent(humanPlayer, botPlayer);
        this.createParty(humanPlayer, botPlayer, true);
    }
    checkMatchQueue() {
        if (this.matchQueue.length >= 2) {
            let leftPlayerId = this.matchQueue.pop();
            let rightPlayerId = this.matchQueue.pop();
            setTimeout(() => {
                let leftPlayer = players[leftPlayerId];
                let rightPlayer = players[rightPlayerId];
                if (leftPlayer == undefined && rightPlayer != undefined)
                    this.matchQueue.push(rightPlayer.id);
                else if (rightPlayer == undefined && leftPlayer != undefined)
                    this.matchQueue.push(leftPlayer.id);
                else if (rightPlayer != undefined && leftPlayer != undefined) {
                    this.sendOpponents(leftPlayer, rightPlayer);
                    this.createParty(leftPlayer, rightPlayer);
                }
            }, 1500);
        }
    }
    createWebConstructs(party) {
        if (party.leftPlayer && party.rightPlayer) {
            let leftClientConstruct = { side: 'left', character: party.leftPlayer.character };
            let rightClientConstruct = { side: 'right', character: party.rightPlayer.character };
            party.leftPlayer.socket?.emit('playerConstruct', leftClientConstruct);
            party.leftPlayer.socket?.emit('playerConstruct', rightClientConstruct);
            party.rightPlayer.socket?.emit('playerConstruct', leftClientConstruct);
            party.rightPlayer.socket?.emit('playerConstruct', rightClientConstruct);
        }
    }
    async sendPartyEnd(winner, party) {
        this.userGameService.createOne({
            player1: party.leftPlayer.userId,
            player2: party.rightPlayer.userId,
            timeStart: party.startTime,
            timeEnd: Date(),
            winner: winner.userId
        });
    }
    async playerIsDead(winner, party) {
        if (party.leftPlayer && party.rightPlayer && winner) {
            let loser = (winner.id == party.leftPlayer.id ? party.rightPlayer : party.leftPlayer);
            const isBotMatch = !!winner.isBot || !!loser.isBot;
            if (!isBotMatch) {
                this.userService.updateRank(winner.userId, 10);
                this.userService.updateRank(loser.userId, -10);
                this.sendPartyEnd(winner, party);
            }
            winner.socket?.emit('eventOn', 'victory');
            loser.socket?.emit('eventOn', 'defeat');
            setTimeout(() => {
                winner.socket?.emit('gameStopped');
                setTimeout(() => {
                    loser.socket?.emit('gameStopped');
                }, 500);
            }, 2500);
        }
    }
    async endWorker(party) {
        party.worker?.terminate();
        if (party.worker)
            console.log('worker [' + party.id.slice(0, 4) + '] terminated');
        party.worker = undefined;
    }
    async handleConnection(socket, ...args) {
        console.log('New player connecting to game socket:', socket.id);
        let userData = await this.chatService.getUserFromSocket(socket);
        if (!userData)
            socket.disconnect();
        players[socket.id] = {
            socket: socket,
            id: socket.id,
            userId: userData.id,
            nickname: userData.nickname,
            workerId: undefined,
            character: userData.character,
            state: 'init'
        };
        console.log("New player in tab:", socket.id);
        socketService.setUser(players[socket.id].userId, socket);
        setTimeout(() => {
            socket.emit('connectionType');
        }, 100);
    }
    async handlePrivate(p1Socket, p2UserId) {
        this.privateRequests.set(p1Socket.id, p2UserId);
        let p1User = await this.chatService.getUserFromSocket(p1Socket);
        let p2SocketList = socketService.getUserSocketIds(p2UserId);
        for (let p2Socket of p2SocketList) {
            let p1UserID = this.privateRequests.get(p2Socket.id);
            if (p1UserID && p1UserID === p1User.id) {
                this.privateRequests.delete(p1Socket.id);
                this.privateRequests.delete(p2Socket.id);
                this.startPrivateGame(p1Socket, p2Socket);
                return;
            }
        }
    }
    handleMatchmaking(socket) {
        this.matchQueue.push(socket.id);
        socket.emit('matching');
        this.checkMatchQueue();
    }
    handleStopMatchmaking(socket) {
        for (let index = 0; index < this.matchQueue.length; index++) {
            if (this.matchQueue[index] == socket.id) {
                this.matchQueue.splice(index, 1);
                break;
            }
        }
        socket.emit('unmatched');
    }
    handlePlayerKeyUpdate(socket, payload) {
        let player = players[socket.id];
        if (player && player.workerId) {
            let party = this.parties[player.workerId];
            if (party.leftPlayer && party.rightPlayer) {
                let update = {
                    side: (party.leftPlayer.id == socket.id ? 'left' : 'right'),
                    keyStates: payload.keys
                };
                party.worker?.postMessage(update);
                let dir = {
                    left: (party.leftPlayer.id == socket.id ? payload.dir : undefined),
                    right: (party.rightPlayer.id == socket.id ? payload.dir : undefined)
                };
                party.leftPlayer.socket?.emit('changeDirection', dir);
                party.rightPlayer.socket?.emit('changeDirection', dir);
            }
        }
    }
    handlePlayerStateUpdate(socket, payload) {
        let player = players[socket.id];
        if (player && player.workerId) {
            let party = this.parties[player.workerId];
            if (party.leftPlayer && party.rightPlayer) {
                let playerSide = (party.leftPlayer.id == player.id ? 'leftPlayer' : 'rightPlayer');
                party[playerSide].state = payload;
                const botSide = (party.leftPlayer.isBot ? 'leftPlayer' : (party.rightPlayer.isBot ? 'rightPlayer' : undefined));
                if (botSide && payload == 'created')
                    party[botSide].state = 'created';
                if (party.rightPlayer.state == 'ready' && party.leftPlayer.state == 'ready')
                    this.createWebConstructs(party);
                else if (party.workerState == 'created' && party.leftPlayer.state == 'created' && party.rightPlayer.state == 'created')
                    party.worker?.postMessage({ newState: 'started' });
            }
        }
    }
    async handleDisconnect(socket) {
        console.log("Socket disconnected:", socket.id);
        let disconnectedPlayer = players[socket.id];
        if (!disconnectedPlayer)
            return;
        if (disconnectedPlayer.workerId === undefined) {
            delete players[socket.id];
            return;
        }
        console.log("Worker id:", disconnectedPlayer.workerId);
        let party = this.parties[disconnectedPlayer.workerId];
        if (!party) {
            delete players[socket.id];
            return;
        }
        if (party.remainingPlayers == 2) {
            party.remainingPlayers--;
            if (party.workerState == 'ended')
                party.worker?.postMessage({ newState: 'achievements' });
            else {
                let remainingPlayer = (party.leftPlayer.id == disconnectedPlayer.id ? party.rightPlayer : party.leftPlayer);
                this.sendPartyEnd(remainingPlayer, party);
                remainingPlayer.socket?.emit('eventOn', 'victory');
                party.worker?.postMessage({ newState: 'stopped' });
                setTimeout(() => {
                    remainingPlayer.socket?.emit('gameStopped');
                }, 3000);
                this.endWorker(party);
            }
        }
        else {
            delete players[party.leftPlayer.id];
            delete players[party.rightPlayer.id];
            party.leftPlayer = undefined;
            party.rightPlayer = undefined;
            delete this.parties[party.id];
        }
    }
};
__decorate([
    WebSocketServer(),
    __metadata("design:type", Server)
], GameGateway.prototype, "server", void 0);
__decorate([
    SubscribeMessage('solo'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Socket]),
    __metadata("design:returntype", Promise)
], GameGateway.prototype, "handleSolo", null);
__decorate([
    SubscribeMessage('private'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Socket, Number]),
    __metadata("design:returntype", Promise)
], GameGateway.prototype, "handlePrivate", null);
__decorate([
    SubscribeMessage('matchmaking'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Socket]),
    __metadata("design:returntype", void 0)
], GameGateway.prototype, "handleMatchmaking", null);
__decorate([
    SubscribeMessage('stopMatchmaking'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Socket]),
    __metadata("design:returntype", void 0)
], GameGateway.prototype, "handleStopMatchmaking", null);
__decorate([
    SubscribeMessage('playerKeyUpdate'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Socket, Object]),
    __metadata("design:returntype", void 0)
], GameGateway.prototype, "handlePlayerKeyUpdate", null);
__decorate([
    SubscribeMessage('playerStateUpdate'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Socket, String]),
    __metadata("design:returntype", void 0)
], GameGateway.prototype, "handlePlayerStateUpdate", null);
GameGateway = __decorate([
    WebSocketGateway({ cors: { origin: '*', methods: ['GET', 'POST'] }, namespace: 'game' }),
    __metadata("design:paramtypes", [UserService,
        UserGameService,
        ChatService])
], GameGateway);
export { GameGateway };
