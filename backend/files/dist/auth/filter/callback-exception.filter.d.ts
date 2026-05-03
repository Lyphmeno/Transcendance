import { ExceptionFilter, ArgumentsHost, UnauthorizedException } from '@nestjs/common';
export declare class CallbackExceptionFilter implements ExceptionFilter {
    catch(exception: UnauthorizedException, host: ArgumentsHost): void;
}
