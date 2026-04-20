import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Prisma } from '@prisma/client'

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {

        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        let status = HttpStatus.INTERNAL_SERVER_ERROR;
        let message = 'Internal server error';

        if (exception instanceof HttpException) {
            status = exception.getStatus();

            const res = exception.getResponse();

            message =
                typeof res === 'string'
                    ? res
                    : (res as any).message || exception.message;
        }
        if (exception instanceof Prisma.PrismaClientKnownRequestError) {

            if (exception.code === 'P2002') {
                status = HttpStatus.BAD_REQUEST
                message = 'Email sudah digunakan'
            }

        }
        response.status(status).json({
            success: false,
            statusCode: status,
            message,
            path: request.url,
            timestamp: new Date().toISOString(),
        });
    }
}