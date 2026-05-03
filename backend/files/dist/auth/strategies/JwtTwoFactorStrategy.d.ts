import { Strategy } from "passport-jwt";
import { PayloadDto } from "../dto/payload.dto.js";
declare const JwtTwoFactorStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtTwoFactorStrategy extends JwtTwoFactorStrategy_base {
    constructor();
    private static extractJWTFromCookie;
    validate(payload: PayloadDto): Promise<any>;
}
export {};
