import { Strategy } from "passport-jwt";
import { PayloadDto } from "../dto/payload.dto.js";
declare const JwtStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtStrategy extends JwtStrategy_base {
    constructor();
    private static extractJWTFromCookie;
    validate(payload: PayloadDto): Promise<any>;
}
export {};
