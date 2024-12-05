import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Post } from './entities/post.entity';

@Module({
    imports: [TypeOrmModule.forFeature([User, Post]), ConfigModule],
    controllers: [PostController],
    providers: [PostService]
})
export class PostModule {}
