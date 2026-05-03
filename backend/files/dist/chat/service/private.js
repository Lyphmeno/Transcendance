export async function createOnePrivMessage(senderId, receiptId, content) {
    try {
        const privMessage = await this.prisma.privMessage.create({
            data: {
                sender: senderId,
                recipient: receiptId,
                content: content
            },
        });
        return privMessage;
    }
    catch (error) {
        console.error(error);
        throw error;
    }
}
export async function getPrivateConversation(firstUser, secondUser) {
    try {
        const conversation = await this.prisma.privMessage.findMany({
            where: {
                OR: [
                    {
                        sender: firstUser,
                        recipient: secondUser,
                    },
                    {
                        sender: secondUser,
                        recipient: firstUser,
                    }
                ],
            },
            orderBy: {
                timeSent: 'asc',
            }
        });
        if (!conversation) {
            throw new Error('conversation was not found');
        }
        return conversation;
    }
    catch (error) {
        console.error(error);
        throw error;
    }
}
export async function blockUser(blockerID, blockeeID) {
    try {
        if (blockerID == blockeeID) {
            throw new Error('cannot block itself');
        }
        const blockee = await this.userService.findOneById(blockeeID);
        if (!blockee) {
            throw new Error('blockee user does not exist');
        }
        const existingBlock = await this.prisma.blocked.findFirst({
            where: {
                AND: [
                    {
                        blocker: blockerID,
                        blockee: blockeeID,
                    }
                ]
            }
        });
        if (existingBlock) {
            throw new Error('user already blocked');
        }
        const blockEntity = await this.prisma.blocked.create({
            data: {
                blocker: blockerID,
                blockee: blockeeID
            }
        });
        if (!blockEntity) {
            throw new Error('could not block');
        }
        return blockEntity;
    }
    catch (error) {
        console.error(error);
        throw error;
    }
}
export async function unblockUser(blockerID, blockeeID) {
    try {
        if (blockerID == blockeeID) {
            throw new Error('cannot unblock itself');
        }
        const blockee = await this.userService.findOneById(blockeeID);
        if (!blockee) {
            throw new Error('blockee user does not exist');
        }
        const existingBlock = await this.prisma.blocked.findFirst({
            where: {
                AND: [
                    {
                        blocker: blockerID,
                        blockee: blockeeID,
                    }
                ]
            }
        });
        if (!existingBlock) {
            throw new Error('user is not blocked');
        }
        await this.prisma.blocked.delete({
            where: {
                id: existingBlock.id,
            }
        });
    }
    catch (error) {
        console.error(error);
        throw error;
    }
}
export async function isBlocked(senderId, recipientID) {
    try {
        if (senderId == recipientID) {
            throw new Error('cannot block itseld');
        }
        const blockee = await this.userService.findOneById(recipientID);
        if (!blockee) {
            throw new Error('blockee user does not exist');
        }
        const existingBlock = await this.prisma.blocked.findFirst({
            where: {
                AND: [
                    {
                        blocker: senderId,
                        blockee: recipientID,
                    }
                ]
            }
        });
        if (existingBlock) {
            return true;
        }
        return false;
    }
    catch (error) {
        console.error(error);
        throw error;
    }
}
export async function hasBlocked(blockerId, blockeeId) {
    try {
        if (blockerId == blockeeId) {
            throw new Error('cannot block itseld');
        }
        const blockee = await this.userService.findOneById(blockeeId);
        if (!blockee) {
            throw new Error('blockee user does not exist');
        }
        const existingBlock = await this.prisma.blocked.findFirst({
            where: {
                AND: [
                    {
                        blocker: blockerId,
                        blockee: blockeeId,
                    }
                ]
            }
        });
        if (existingBlock) {
            return true;
        }
        return false;
    }
    catch (error) {
        console.error(error);
        throw error;
    }
}
