import { parse } from 'cookie';
export async function getUserFromSocket(client) {
    const cookie = client.handshake.headers.cookie;
    if (cookie) {
        const { access_token: authenticationToken } = parse(cookie);
        if (!authenticationToken)
            return;
        const user = await this.authservice.getUserfromAuthenticationToken(authenticationToken);
        return user;
    }
    console.log('there is no cookie :(');
}
