import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Post } from './entities/post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Like, Repository, UpdateResult } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { FilterPostDto } from './dto/filter-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

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
    async findAll(query: FilterPostDto): Promise<any> {
        const items_per_page = Number(query.items_per_page) || 10;
        const page = Number(query.page) || 1;
        const search = query.search || '';
        const category = Number(query.category) || null;

        const skip = (page - 1) * items_per_page;
        const [res, total] = await this.postRepository.findAndCount({
            where: [
                {
                    // search theo theo từ khoá tìm ra post mà cái post phải có categry trùng với id của category mà post đó đang sở hữu
                    // mỗi bài post sẽ có 1 cateogry id (bài post đó thuộc về category nào đó). search title mà kèm theo điều kiện category
                    // thì kết hợp cả 2 cho ra 1 kết quả gần nhất.
                    // nếu như category không tuyền thì nó null, id: null coi như ko có
                    title: Like('%' + search + '%'),
                    category: {
                        id: category
                    }
                },
                {
                    description: Like('%' + search + '%'),
                    category: {
                        id: category
                    }
                },
                {
                    category: {
                        name: Like('%' + search + '%'), // Truy vấn name từ quan hệ category
                        id: category // Optional nếu cần kết hợp với id category
                    }
                }
            ],
            order: { created_at: 'DESC' },
            take: items_per_page,
            skip: skip,
            relations: {
                user: true,
                category: true
            },
            select: {
                user: {
                    id: true,
                    first_name: true,
                    last_name: true,
                    email: true,
                    avatar: true
                },
                category: {
                    id: true,
                    name: true
                }
            }
        });

        const lastPage = Math.ceil(total / items_per_page);
        const nextPage = page + 1 > lastPage ? null : page + 1;
        const prevPage = page - 1 < 1 ? null : page - 1;

        return {
            data: res,
            total,
            currentPage: page,
            nextPage,
            prevPage,
            lastPage
        };
    }
    async findDetail(id: number): Promise<Post> {
        return await this.postRepository.findOne({
            where: {
                id: id
            },
            relations: ['user', 'category'],
            select: {
                // đoạn này đang select thêm thông tin của user tạo ra bài post, muốn làm được vậy phải chỉ ra được post có quan hệ với user bằng relations
                user: {
                    id: true,
                    first_name: true,
                    last_name: true,
                    email: true,
                    avatar: true
                },
                category: {
                    id: true,
                    name: true
                }
            }
        });
    }
    async update(
        id: number,
        updatePostDto: UpdatePostDto
    ): Promise<UpdateResult> {
        return await this.postRepository.update(id, updatePostDto);
    }
    async delete(id: number): Promise<DeleteResult> {
        return await this.postRepository.delete(id);
    }
}
