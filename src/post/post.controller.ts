import {
    Controller,
    Post,
    Req,
    Body,
    UseInterceptors,
    UploadedFile,
    UseGuards,
    BadRequestException
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { storageConfig } from 'helpers/config';
import { AuthGuard } from 'src/auth/auth.guard';
import { extname } from 'path';
import { PostService } from './post.service';

@Controller('posts')
export class PostController {
    constructor(private postService: PostService) {}
    @UseGuards(AuthGuard)
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
}
