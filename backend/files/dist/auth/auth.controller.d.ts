/// <reference types="cookie-parser" />
import { AuthService } from './auth.service.js';
import { Request, Response } from 'express';
import { UserService } from '../user/user.service.js';
import { User } from '@prisma/client';
export declare class AuthController {
    private authService;
    private userService;
    private readonly hostIp;
    constructor(authService: AuthService, userService: UserService);
    handle42Loging(): void;
    handle42Redirect(req: any, res: Response): Promise<void>;
    logout(req: Request, res: Response): any;
    activate2FA(req: any): Promise<User>;
    deactivate2FA(req: any): Promise<User>;
    addNewSecret(req: any): Promise<User>;
    getSecretStatus(req: any): Promise<boolean>;
    generateQRCode(req: any, res: any): Promise<any>;
    verify2FACode(req: any, res: Response, code: string): Promise<any>;
}
