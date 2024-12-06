import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config'; // Import ConfigModule

@Module({
    // phải đăng ký User thì user mới được sử dụng ở đây
    imports: [
        TypeOrmModule.forFeature([User]),
        JwtModule.register({
            global: true,
            secret: '123456',
            // signOptions: { expiresIn: '1h' } // hết hạn sau 1 tiếng
            signOptions: { expiresIn: 10 } // hết hạn sau 10 giây - ngắn đi để test
        }),
        ConfigModule // Import ConfigModule
    ],
    controllers: [AuthController],
    providers: [AuthService]
})
export class AuthModule {}
