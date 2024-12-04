import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    Query,
    UseGuards
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { AuthGuard } from 'src/auth/auth.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { query } from 'express';
import { FilterUserDto } from './dto/filter-user.dto';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';

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

    @UseGuards(AuthGuard) // chuyển thành api private
    @Delete(':id')
    deleteUser(@Param('id') id: string) {
        return this.userService.delete(Number(id));
    }
}
