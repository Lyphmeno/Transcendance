import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service.js';
export declare class AuthService {
    private jwtService;
    private readonly userService;
    constructor(jwtService: JwtService, userService: UserService);
    login(user: any, is2FAAuthenticated: boolean): Promise<any>;
    getUserfromAuthenticationToken(token: string): Promise<import("@prisma/client/runtime/index.js").GetResult<{
        id: number;
        email: string;
        nickname: string;
        avatarFilename: string;
        story: string;
        rankPoints: number;
        character: string;
        twoFactorAuthStatus: boolean;
        twoFactorAuthSecret: string;
    }, unknown, never> & {}>;
}
