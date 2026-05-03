import { Profile } from 'passport-42';
import { User } from '@prisma/client';
import { UserService } from '../../user/user.service.js';
declare const FortyTwoStrategy_base: new (...args: any[]) => any;
export declare class FortyTwoStrategy extends FortyTwoStrategy_base {
    private readonly userService;
    constructor(userService: UserService);
    validate(accessToken: string, refreshToken: string, profile: Profile, done: Function): Promise<User>;
}
export {};
