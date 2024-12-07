import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseArrayPipe,
    Post,
    Put,
    Query,
    Req,
    UploadedFile,
    UseGuards,
    UseInterceptors
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { AuthGuard } from 'src/auth/auth.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FilterUserDto } from './dto/filter-user.dto';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { storageConfig } from 'helpers/config';
import { extname } from 'path';

@ApiBearerAuth()
@ApiTags('Users')
@Controller('users')
export class UserController {
    constructor(private userService: UserService) {}

    @UseGuards(AuthGuard)
    @ApiQuery({ name: 'page' })
    @ApiQuery({ name: 'items_per_page' })
    @ApiQuery({ name: 'search' })
    @Get()
    findAll(@Query() query: FilterUserDto): Promise<User[]> {
        console.log(query);
        return this.userService.findAll(query);
    }

    // lấy ra 1 user chi tiết - phải kèm id - dựa vào id để query database
    @UseGuards(AuthGuard) // lúc này api này đã thành private
    @Get(':id')
    findOne(@Param('id') id: string): Promise<User> {
        // Dữ liệu lấy từ params và query qua request đều mặc định là kiểu chuỗi (string).
        // Còn id nếu là chuỗi bỏ qua bước ép kiểu Number(id)
        return this.userService.findOne(Number(id));
    }

    @UseGuards(AuthGuard) // chuyển thành api private
    @Post()
    createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
        return this.userService.create(createUserDto);
    }

    @UseGuards(AuthGuard) // chuyển thành api private
    // type hàm này Promise<UpdateResult>
    @Put(':id')
    updateUser(@Body() updateUserDto: UpdateUserDto, @Param('id') id: string) {
        return this.userService.update(Number(id), updateUserDto);
    }

    // Phải đặt nó nằm trước
    @Delete('multiple')
    multipleDelete(
        @Query('ids', new ParseArrayPipe({ items: String, separator: ',' }))
        ids: string[]
    ) {
        console.log('delete multi=> ', ids);
        return this.userService.multipleDelete(ids);
    }

    @UseGuards(AuthGuard) // chuyển thành api private
    @Delete(':id')
    deleteUser(@Param('id') id: string) {
        return this.userService.delete(Number(id));
    }

    // Xoá nhiều dữ liệu cùng 1 lúc
    // @UseGuards(AuthGuard)
    // @Delete('multiple')
    // multipleDelete(@Query('ids') ids: string[]) {
    //     console.log('Delete multi =>', ids);
    // }

    // items: String, separator: ','  convert chuỗi thành mảng dựa trên dấu phẩy chia thành 1 ô trong mảng

    // Sau khi có ảnh tải lên - thì cần có id chính xác của user đó mình mới có thể cập nhật avatar cho user
    // giống như get user cụ thể hoặc edit hay delete cần id truyền params
    // ở nâng cấp hơn mình không dùng như vậy mà mình sẽ lấy id đó từ token -> access_token ra để mà biết được user đó và lưu ảnh cho nó
    // trong req - có access_token và trong access_token có user_data
    @Post('upload-avatar')
    @UseGuards(AuthGuard)
    @UseInterceptors(
        FileInterceptor('avatar', {
            storage: storageConfig('avatar'), // config tạo ra folder chứa ảnh
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
    uploadAvatar(@Req() req: any, @UploadedFile() file: Express.Multer.File) {
        console.log('upload avatar');
        console.log('user', req.user_data); // user_data là do auth - middleware / gaurd ký với cái tên user_data - req.user_data thì sẽ ra được khoá đã ký
        console.log(file);

        if (req.fileValidationError) {
            throw new BadRequestException(req.fileValidationError);
        }

        if (!file) {
            throw new BadRequestException('file is required');
        }

        return this.userService.updateAvatar(
            Number(req.user_data.id), // id của user đó
            file.destination + '/' + file.filename // object đường dẫn của ảnh
        );
    }
}
