import {
    Controller,
    Req,
    Body,
    UseInterceptors,
    UploadedFile,
    UseGuards,
    BadRequestException,
    Get,
    Query,
    Param,
    Post,
    Put,
    Delete,
    UsePipes,
    ValidationPipe
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { storageConfig } from 'helpers/config';
import { AuthGuard } from 'src/auth/auth.guard';
import { extname } from 'path';
import { PostService } from './post.service';
import { query } from 'express';
import { FilterPostDto } from './dto/filter-post.dto';
import { Post as PostEntity } from './entities/post.entity'; // đặt lại tên bài viết thành PostEntity để khỏi trùng tên với Phương thức Post của @nestjs/common cung cấp
import { UpdatePostDto } from './dto/update-post.dto';

@Controller('posts')
export class PostController {
    constructor(private postService: PostService) {}
    @UseGuards(AuthGuard)
    @UsePipes(ValidationPipe)
    @Post()
    @UseInterceptors(
        FileInterceptor('thumbnail', {
            storage: storageConfig('post'),
            fileFilter: (req, file, cb) => {
                // npm install --save path - thư viện này sẽ hỗ trợ mình lấy ra original name
                const ext = extname(file.originalname);
                const allowedExtArr = ['.jpg', '.png', '.jpeg'];
                // kiểm tra tên file đó có định dạng như trong mảng allowedExtArr mình đã liệt kê hay không
                // Nếu không có trả về false có trả về true - nghịch đảo true thành false bỏ qua if chạy vào else ngược lại nếu false - thành true vào if
                if (!allowedExtArr.includes(ext)) {
                    req.fileValidationError = `wrong extension type. Accepted file ext type: ${allowedExtArr.toString()} `;
                    cb(null, false);
                } else {
                    const fileSize = parseInt(req.headers['content-length']);
                    if (fileSize > 1024 * 1024 * 5) {
                        req.fileValidationError = `File size is too large. Accepted file size is less than 5MB`;
                        cb(null, false);
                    } else {
                        cb(null, true);
                    }
                }
            } // cái config các rule khi upload ảnh lên (file up lên phải là đuôi png, jpeg,... và nhỏ hơn 5mb)
        })
    )
    create(
        @Req() req: any,
        @Body() createPostDto: CreatePostDto,
        @UploadedFile() file: Express.Multer.File
    ) {
        console.log(req[`user_data`]);
        console.log(createPostDto);
        console.log(file);

        if (req.fileValidationError) {
            throw new BadRequestException(req.fileValidationError);
        }

        if (!file) {
            throw new BadRequestException('file is required');
        }
        return this.postService.create(req['user_data'].id, {
            ...createPostDto,
            thumbnail: file.destination + '/' + file.filename
        });
    }

    /*
        query: FilterPostDto sẽ chứa
        - page: string;
        - item_per_page: string;
        - search: string;
        */
    @UseGuards(AuthGuard)
    @Get()
    findAll(@Query() query: FilterPostDto): Promise<any> {
        return this.postService.findAll(query);
    }

    @UseGuards(AuthGuard)
    @Get(':id')
    findDetail(@Param('id') id: string): Promise<PostEntity> {
        return this.postService.findDetail(Number(id));
    }

    @UseGuards(AuthGuard)
    @Put(':id')
    @UseInterceptors(
        FileInterceptor('thumbnail', {
            storage: storageConfig('post'),
            fileFilter: (req, file, cb) => {
                // npm install --save path - thư viện này sẽ hỗ trợ mình lấy ra original name
                const ext = extname(file.originalname);
                const allowedExtArr = ['.jpg', '.png', '.jpeg'];
                // kiểm tra tên file đó có định dạng như trong mảng allowedExtArr mình đã liệt kê hay không
                // Nếu không có trả về false có trả về true - nghịch đảo true thành false bỏ qua if chạy vào else ngược lại nếu false - thành true vào if
                if (!allowedExtArr.includes(ext)) {
                    req.fileValidationError = `wrong extension type. Accepted file ext type: ${allowedExtArr.toString()} `;
                    cb(null, false);
                } else {
                    const fileSize = parseInt(req.headers['content-length']);
                    if (fileSize > 1024 * 1024 * 5) {
                        req.fileValidationError = `File size is too large. Accepted file size is less than 5MB`;
                        cb(null, false);
                    } else {
                        cb(null, true);
                    }
                }
            } // cái config các rule khi upload ảnh lên (file up lên phải là đuôi png, jpeg,... và nhỏ hơn 5mb)
        })
    )
    update(
        @Param('id') id: string,
        @Req() req: any,
        @Body() updatePostDto: UpdatePostDto,
        @UploadedFile() file: Express.Multer.File
    ) {
        if (req.fileValidationError) {
            throw new BadRequestException(req.fileValidationError);
        }

        if (file) {
            updatePostDto.thumbnail = file.destination + '/' + file.filename;
        }

        return this.postService.update(Number(id), updatePostDto);
    }

    @UseGuards(AuthGuard)
    @Delete(':id')
    delete(@Param('id') id: string) {
        return this.postService.delete(Number(id));
    }
}
