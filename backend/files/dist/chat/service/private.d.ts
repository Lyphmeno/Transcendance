import { PrivMessage } from "@prisma/client";
import { Blocked } from '@prisma/client';
export declare function createOnePrivMessage(senderId: number, receiptId: number, content: string): Promise<PrivMessage>;
export declare function getPrivateConversation(firstUser: number, secondUser: number): Promise<PrivMessage[]>;
export declare function blockUser(blockerID: number, blockeeID: number): Promise<Blocked | null>;
export declare function unblockUser(blockerID: number, blockeeID: number): Promise<void>;
export declare function isBlocked(senderId: number, recipientID: number): Promise<boolean>;
export declare function hasBlocked(blockerId: number, blockeeId: number): Promise<boolean>;
