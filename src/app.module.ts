import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from 'db/data-source';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';

@Module({
    imports: [
        TypeOrmModule.forRoot(
            //   {
            //     type: 'mysql',
            //     host: 'localhost',
            //     port: 3309,
            //     username: 'root',
            //     password: '',
            //     database: 'Blog',
            //     entities: [User], // đăng ký User để vào hàng tự sinh
            //     synchronize: true // đoạn này xem entities có entities thì sinh ra bảng đó.
            // }
            // Thay vì dùng như trên mình sẽ tách ra dataSourceOptions sau đó custom lại không cho tự sinh và cấu hình migrations
            dataSourceOptions
        ),
        UserModule,
        AuthModule
    ],
    controllers: [AppController],
    providers: [AppService]
})
export class AppModule {}
