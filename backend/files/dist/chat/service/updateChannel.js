import { WsException } from '@nestjs/websockets';
export async function setChanPassword(chanId, userId, newPasswd) {
    try {
        if (this.isAdmin(chanId, userId)) {
            const updatedChannel = await this.prisma.channel.update({
                where: { id: chanId },
                data: { passwd: newPasswd }
            });
            if (!updatedChannel) {
                throw new Error("Error in setting new passwd");
            }
            return updatedChannel;
        }
        else {
            throw new Error("User is not admin");
        }
    }
    catch (error) {
        console.error(error);
        throw error;
    }
}
export async function removeChanPassword(chanId, userId) {
    try {
        if (this.isAdmin(chanId, userId)) {
            const updatedChannel = await this.prisma.channel.update({
                where: { id: chanId },
                data: { passwd: null }
            });
            if (!updatedChannel) {
                throw new Error("Error in removing password");
            }
            return updatedChannel;
        }
        else {
            throw new Error("User is not admin");
        }
    }
    catch (error) {
        console.error(error);
        throw error;
    }
}
export async function setChanName(data) {
    try {
        const { chanMember, chanId, newChanName } = data;
        const isAdmin = await this.isAdmin(chanId, chanMember);
        if (!isAdmin) {
            throw new Error('Member does not have channel privileges');
        }
        else {
            const updatedChannel = await this.prisma.channel.update({
                where: { id: chanId },
                data: { name: newChanName }
            });
            if (!updatedChannel) {
                throw new Error("Could not change name");
            }
            return updatedChannel;
        }
    }
    catch (error) {
        console.error(error);
        throw error;
    }
}
export async function setChannelType(userId, chanID, type) {
    try {
        const isOwner = await this.isOwner(chanID, userId);
        if (!isOwner) {
            throw new Error('not an owner, cannot set type');
        }
        const channel = await this.prisma.channel.update({
            where: { id: chanID },
            data: { type }
        });
        if (!channel) {
            throw new Error('could not change channel type');
        }
        return channel;
    }
    catch (error) {
        console.error(error);
        throw error;
    }
}
export async function makeOwnerAdmin(userId, chanId) {
    try {
        const updatedMember = await this.prisma.chanMember.update({
            where: {
                chanId_member: {
                    chanId,
                    member: userId,
                },
            },
            data: {
                isAdmin: true,
            }
        });
        if (!updatedMember) {
            throw new Error('could not make user admin of channel');
        }
        return updatedMember;
    }
    catch (error) {
        console.error(error);
        throw error;
    }
}
export async function makeChanAdmin(data) {
    try {
        const { chanOwnerId, chanId, memberId } = data;
        const isOwner = await this.isOwner(chanId, chanOwnerId);
        if (!isOwner) {
            throw new WsException('not channel owner');
        }
        else {
            const updatedMember = await this.prisma.chanMember.update({
                where: {
                    chanId_member: {
                        chanId,
                        member: memberId,
                    },
                },
                data: {
                    isAdmin: true,
                }
            });
            if (!updatedMember) {
                throw new Error('could not make user admin of channel');
            }
            return updatedMember;
        }
    }
    catch (error) {
        console.error(error);
        throw error;
    }
}
export async function removeChanAdmin(data) {
    try {
        const { chanOwnerId, chanId, memberId } = data;
        const isOwner = await this.isOwner(chanId, chanOwnerId);
        if (!isOwner) {
            throw new WsException('not channel owner');
        }
        else {
            const updatedMember = await this.prisma.chanMember.update({
                where: {
                    chanId_member: {
                        chanId,
                        member: memberId,
                    },
                },
                data: {
                    isAdmin: false,
                }
            });
            if (!updatedMember) {
                throw new Error('could not make user admin of channel');
            }
            return updatedMember;
        }
    }
    catch (error) {
        console.error(error);
        throw error;
    }
}
