import { Socket } from 'socket.io';
export declare class UserSocketsService {
    private userSocketIdMap;
    setUser(userID: number, socket: Socket): void;
    getUserSocketIds(userID: number): Socket[];
    deleteUserSocket(userID: number, socket: Socket): void;
}
