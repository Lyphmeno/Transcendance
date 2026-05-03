export async function deleteChannel(chanId) {
    try {
        await this.prisma.chanMember.deleteMany({
            where: {
                chanId: chanId,
            },
        });
        await this.prisma.chanBan.deleteMany({
            where: {
                chanId: chanId,
            },
        });
        await this.prisma.chanMessage.deleteMany({
            where: {
                chanId: chanId,
            },
        });
        await this.prisma.channel.delete({
            where: {
                id: chanId,
            },
        });
    }
    catch (error) {
        console.error(error);
        throw error;
    }
}
