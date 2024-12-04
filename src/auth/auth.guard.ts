import { JwtService } from '@nestjs/jwt';
// đóng vai trò kẻ gác cổng
// middleware

/*
	•	Chủ yếu được sử dụng để bảo vệ và kiểm tra quyền truy cập trước khi xử lý một request.
	•	Dựa trên kết quả (true hoặc false), Guard quyết định xem request có được tiếp tục hay không.
*/

import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException
} from '@nestjs/common';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';

@Injectable() // có thể đem nó đi sử dụng ở các module khác
export class AuthGuard implements CanActivate {
    constructor(
        private jwtService: JwtService,
        private configService: ConfigService
    ) {}
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);
        // nếu trả về 1 chuỗi - truthy - > true -> nghịch đảo true false không vào trong if
        // nếu nó là undefined - falsy -> false -> nghịch đảo false thành true lọt trong if
        if (!token) {
            throw new UnauthorizedException(); // chưa xác thực
        }

        // verify token
        try {
            const payload = await this.jwtService.verifyAsync(token, {
                secret: this.configService.get<string>('SECRET')
            });
            // token: sẽ chứa id, email,...
            // đính kèm nó vào userRequest
            request['user_data'] = payload;
        } catch (error) {
            throw new UnauthorizedException();
        }

        return true;
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization
            ? request.headers.authorization.split(' ')
            : []; // Bearer 12nbdj13 - cắt ra làm 2 thông qua split cắt thành 2 khúc Bearer gán cho type, chuỗi token sẽ gán cho token

        // sử dụng toán tử 3 ngôi check type nếu Bearer chắc chắn có token - trả về token
        // còn mà không có Bearer chắc mảng [] sẽ trả về undefined
        return type === 'Bearer' ? token : undefined;
    }
}
