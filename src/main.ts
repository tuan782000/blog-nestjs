import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
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
    await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
