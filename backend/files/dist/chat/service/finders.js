export async function findChannelbyId(id) {
    try {
        const foundChannel = await this.prisma.channel.findUnique({
            where: { id },
        });
        if (!foundChannel) {
            throw new Error('channel with given id not found');
        }
        return foundChannel;
    }
    catch (error) {
        console.error(error);
        throw error;
    }
}
export async function findAllMembersByChanID(chanId) {
    try {
        const members = await this.prisma.chanMember.findMany({
            where: {
                chanId,
            },
            include: {
                memberRef: {
                    select: {
                        nickname: true,
                    },
                },
            },
        });
        if (!members) {
            throw new Error('members for given chanID not found');
        }
        return members;
    }
    catch (error) {
        console.error(error);
        throw error;
    }
}
export async function findAllNonMembersByChanId(chanId) {
    try {
        const members = await this.prisma.chanMember.findMany({
            where: {
                chanId: chanId,
            },
            select: {
                member: true,
            },
        });
        const memberIds = members.map(member => member.member);
        const nonMembers = await this.prisma.user.findMany({
            where: {
                id: {
                    notIn: memberIds,
                },
            },
        });
        return nonMembers;
    }
    catch (error) {
        console.error(error);
        throw error;
    }
}
export async function findAllChannelsByMember(member) {
    try {
        const channels = await this.prisma.chanMember.findMany({
            where: {
                member,
            },
        });
        if (!channels) {
            return [];
        }
        return channels;
    }
    catch (error) {
        console.error(error);
        throw error;
    }
}
export async function findAllChannelsNonMember(member) {
    try {
        const memberChannels = await this.prisma.chanMember.findMany({
            where: {
                member,
            },
        });
        const memberChannelIds = memberChannels.map(channel => channel.chanId);
        const nonMemberChannels = await this.prisma.channel.findMany({
            where: {
                id: {
                    notIn: memberChannelIds,
                },
            },
        });
        if (!nonMemberChannels) {
            return [];
        }
        return nonMemberChannels;
    }
    catch (error) {
        console.error(error);
        throw error;
    }
}
export async function findAllChannelsByUserId(member) {
    try {
        const channels = await this.prisma.chanMember.findMany({
            where: {
                member,
            },
            include: {
                chanRef: true,
            },
        }).then(chanMembers => chanMembers.map(chanMember => chanMember.chanRef));
        if (!channels?.length) {
            return [];
        }
        return channels;
    }
    catch (error) {
        console.error(error);
        throw error;
    }
}
export async function findChannelsthatStartby(startBy) {
    try {
        const channels = await this.prisma.channel.findMany({
            where: {
                startsWith: startBy,
            }
        });
        if (!channels) {
            return [];
        }
        return channels;
    }
    catch (error) {
        console.error(error);
        throw error;
    }
}
export async function findAllPublicChannels() {
    try {
        const channels = await this.prisma.channel.findMany({
            where: {
                type: 'PUBLIC'
            }
        });
        if (!channels) {
            return [];
        }
        return channels;
    }
    catch (error) {
        console.error(error);
        throw error;
    }
}
export async function findAllProtectedChannels() {
    try {
        const channels = await this.prisma.channel.findMany({
            where: {
                type: 'PROTECTED'
            }
        });
        if (!channels) {
            throw new Error('no protected channels');
        }
        return channels;
    }
    catch (error) {
        console.error(error);
        throw error;
    }
}
export async function findAllChannelsNotMember() {
    try {
        const channels = await this.prisma.channel.findMany({
            where: {
                type: 'PROTECTED'
            }
        });
        if (!channels) {
            throw new Error('no protected channels');
        }
        return channels;
    }
    catch (error) {
        console.error(error);
        throw error;
    }
}
export async function findManyChanMessages(chanId, count) {
    try {
        const messages = await this.prisma.chanMessage.findMany({
            where: {
                chanId,
            },
            orderBy: {
                timeSent: "asc",
            },
            take: count,
        });
        if (!messages) {
            throw new Error('could not find the quantity of messages required');
        }
        return messages;
    }
    catch (error) {
        console.error(error);
        throw error;
    }
}
export async function findAllChanMessages(chanId) {
    try {
        const messages = await this.prisma.chanMessage.findMany({
            where: {
                chanId,
            },
            orderBy: {
                timeSent: "asc",
            },
        });
        if (!messages) {
            throw new Error('could not find messages for given channel');
        }
        return messages;
    }
    catch (error) {
        console.error(error);
        throw error;
    }
}
export async function findUserStartsby(startBy, userId) {
    try {
        const users = await this.prisma.user.findMany({
            where: {
                AND: [
                    {
                        nickname: {
                            startsWith: startBy,
                        }
                    },
                    {
                        id: {
                            not: userId,
                        }
                    }
                ]
            }
        });
        if (!users) {
            throw new Error('users by member not found');
        }
        return users;
    }
    catch (error) {
        console.error(error);
        throw error;
    }
}
