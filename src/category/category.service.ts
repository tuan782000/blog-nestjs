import { Body, Injectable, Param, Req, UploadedFile } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { DeleteResult, Like, Repository, UpdateResult } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { FilterCategoryDto } from './dto/filter-category.dto';

@Injectable()
export class CategoryService {
    constructor(
        @InjectRepository(Category)
        private categoryRepository: Repository<Category>
    ) {}

    async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
        return await this.categoryRepository.save(createCategoryDto);
    }

    async findAll(query: FilterCategoryDto): Promise<any> {
        const items_per_page = Number(query.items_per_page) || 10;
        const page = Number(query.page) || 1;
        const skip = (page - 1) * items_per_page;
        const keyword = query.search || '';
        const [res, total] = await this.categoryRepository.findAndCount({
            where: [
                { name: Like('%' + keyword + '%') },
                { description: Like('%' + keyword + '%') }
            ],
            order: { created_at: 'DESC' },
            take: items_per_page, // giới hạn số phần tử lấy trong 1 lần request (10) - 1000 user lấy hết 1000 query rất lâu - hạn chế 10 query tăng tốc độ lên
            skip: skip, // bỏ qua các phần tử trước đó để lấy tiếp số phần tử tiếp theo tương ứng với take quy định
            select: [
                'id',
                'name',
                'description',
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

    async findOne(id: number): Promise<Category> {
        return await this.categoryRepository.findOneBy({ id: id });
    }

    async update(
        id: number,
        updateCategoryDto: UpdateCategoryDto
    ): Promise<UpdateResult> {
        return await this.categoryRepository.update(id, updateCategoryDto);
    }

    async delete(id: number): Promise<DeleteResult> {
        return await this.categoryRepository.delete(id);
    }
}
