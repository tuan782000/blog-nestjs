import { UpdateUserDto } from './dto/update-user.dto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { DeleteResult, Like, Repository, UpdateResult } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { FilterUserDto } from './dto/filter-user.dto';

@Injectable()
export class UserService {
    // để mà tương tác db - thông qua repositpory - ở đây tạo constructor
    // Tạo constructor
    constructor(
        @InjectRepository(User) private userRepository: Repository<User>
        // private jwtService: JwtService,
        // private configService: ConfigService
    ) {}

    // version 01: chỉ lấy ra tất cả
    // async findAll(): Promise<User[]> {
    //     return await this.userRepository.find({
    //         select: [
    //             'id',
    //             'first_name',
    //             'last_name',
    //             'email',
    //             'status',
    //             'created_at',
    //             'updated_at'
    //         ]
    //         // Nếu sau này phát triển tính năng tìm kiếm và phân trang thì phát triển code thêm ở đây, dùng where để truy vấn
    //     });
    // }

    // version 02: nâng cấp thêm query để làm search với phân trang
    async findAll(query: FilterUserDto): Promise<any> {
        const items_per_page = Number(query.items_per_page) || 10; // ép kiểu từ query - nó là tring ép thành kiểu số
        const page = Number(query.page) || 1;
        // 2 thuật ngữ take và skip - take là số phần tử sẽ lấy - skip số phần tử sẽ bỏ qua
        // items_per_page phục vụ cho take
        const skip = (page - 1) * items_per_page;
        // hàm findAndCount là nestjs cung cấp giúp trả về res total - res là kết quả mà mình mong muốn khi query - total là tổng record có trong table đó (table users)
        const keyword = query.search || '';
        const [res, total] = await this.userRepository.findAndCount({
            where: [
                { first_name: Like('%' + keyword + '%') },
                { last_name: Like('%' + keyword + '%') },
                { email: Like('%' + keyword + '%') }
            ], // tìm kiếm - theo điều kiện - đi where và like
            order: { created_at: 'DESC' }, // sắp xếp giảm dần - thằng mới tạo đưa lên đầu - thằng tạo đầu tiên sẽ cuối danh sách.
            take: items_per_page, // giới hạn số phần tử lấy trong 1 lần request (10) - 1000 user lấy hết 1000 query rất lâu - hạn chế 10 query tăng tốc độ lên
            skip: skip, // bỏ qua các phần tử trước đó để lấy tiếp số phần tử tiếp theo tương ứng với take quy định
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

        const lastPage = Math.ceil(total / items_per_page);
        const nextPage = page + 1 > lastPage ? null : page + 1;
        const prevPage = page - 1 < 1 ? null : page - 1;

        return {
            data: res,
            total,
            currentPage: page,
            nextPage, // nextPage: nextPage,
            prevPage, // prevPage: prevPage,
            lastPage //lastPage: lastPage
        };
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

    async updateAvatar(id: number, avatar: string): Promise<UpdateResult> {
        return await this.userRepository.update(id, { avatar });
    }
}
