import { CanActivate, ExecutionContext } from "@nestjs/common";
import { Observable } from "rxjs";
import { ChannelService } from "./channel.service.js";
export declare class ChannelMemberGuard implements CanActivate {
    private channelService;
    constructor(channelService: ChannelService);
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean>;
    validateRequest(request: any): Promise<boolean>;
}
