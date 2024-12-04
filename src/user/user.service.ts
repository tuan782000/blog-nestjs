import { UpdateUserDto } from './dto/update-user.dto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
    // để mà tương tác db - thông qua repositpory - ở đây tạo constructor
    // Tạo constructor
    constructor(
        @InjectRepository(User) private userRepository: Repository<User>
        // private jwtService: JwtService,
        // private configService: ConfigService
    ) {}

    async findAll(): Promise<User[]> {
        return await this.userRepository.find({
            select: [
                'id',
                'first_name',
                'last_name',
                'email',
                'status',
                'created_at',
                'updated_at'
            ]
            // Nếu sau này phát triển tính năng tìm kiếm và phân trang thì phát triển code thêm ở đây, dùng where để truy vấn
        });
    }

    async findOne(id: number): Promise<User> {
        return await this.userRepository.findOneBy({ id: id });
    }

    async create(createUserDto: CreateUserDto): Promise<User> {
        // hash password trước khi insert vào db
        const hashPassword = await bcrypt.hash(createUserDto.password, 10);
        return await this.userRepository.save({
            ...createUserDto,
            password: hashPassword
        });
    }

    // khi mà update orm cung cấp 1 type riêng UpdateResult - dùng này
    async update(
        id: number,
        updateUserDto: UpdateUserDto
    ): Promise<UpdateResult> {
        return await this.userRepository.update(id, updateUserDto);
    }

    // delete
    async delete(id: number): Promise<DeleteResult> {
        return await this.userRepository.delete(id);
    }
}
