import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Post } from './entities/post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class PostService {
    constructor(
        @InjectRepository(User) private userRepository: Repository<User>, // đăng ký bên module nữa nhé
        @InjectRepository(Post) private postRepository: Repository<Post> // đăng ký bên module nữa nhé
    ) {}
    async create(userId: number, createPostDto: CreatePostDto): Promise<Post> {
        const user = await this.userRepository.findOneBy({ id: userId });

        try {
            const res = await this.postRepository.save({
                ...createPostDto,
                user
            });
            return await this.postRepository.findOneBy({
                id: res.id
            });
        } catch (error) {
            throw new HttpException(
                'Can not create post',
                HttpStatus.BAD_REQUEST
            );
        }
    }
}
