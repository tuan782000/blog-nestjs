import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express'; // Thêm này cho phần static file

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule); // thêm NestExpressApplication này cho phần static file
    const config = new DocumentBuilder()
        .setTitle('Blogs api')
        .setDescription('List api for simple blog by tuan nguyen')
        .setVersion('1.0')
        .addTag('Auth')
        .addTag('Users')
        .addBearerAuth() // thêm authentication
        .build();
    const document = () => SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);
    app.enableCors(); // không chặn api từ react gọi lên server
    app.useStaticAssets(join(__dirname, '../../uploads')); // báo rằng các file trong folder uploads này được public - có thể truy cập
    await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
