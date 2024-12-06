import {
    Body,
    Controller,
    Post,
    Req,
    UseGuards,
    UsePipes,
    ValidationPipe
} from '@nestjs/common';
import { RegisterUserDto } from './dto/register-user.dto';
import { AuthService } from './auth.service';
import { User } from 'src/user/entities/user.entity';
import { LoginUserDto } from './dto/login-user.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from './auth.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}
    // @Post('register')
    // register(@Body() registerUserDto: RegisterUserDto): void {
    //     console.log('test rigster api');
    //     console.log(registerUserDto);
    //     this.authService.register(registerUserDto);
    // }

    // khi triển khai lên Type sẽ function register sẽ là Promise<User> để quy định return nó sẽ trả về 1 User
    @Post('register')
    @ApiResponse({
        status: 201,
        description: 'Register successfully'
    })
    @ApiResponse({
        status: 401,
        description: 'Register failed!'
    })
    @UsePipes(ValidationPipe)
    register(@Body() registerUserDto: RegisterUserDto): Promise<User> {
        // console.log('test rigster api');
        // console.log(registerUserDto);
        return this.authService.register(registerUserDto); // return sẽ trả về user tạo được dưới json cho front end nhận
    }

    //Bước 1: mình cũng cần định nghĩa dto để custom dữ liệu client gửi lên server cho nó đúng
    //Bước 2: service để viết chức năng
    @Post('login')
    @ApiResponse({
        status: 201,
        description: 'Login successfully'
    })
    @ApiResponse({
        status: 401,
        description: 'Login failed!'
    })
    @UsePipes(ValidationPipe)
    login(@Body() loginUserDto: LoginUserDto): Promise<any> {
        // console.log('test login api');
        // console.log(loginUserDto);

        return this.authService.login(loginUserDto); // trả về client { access_token, refresh_token }
    }

    @Post('refresh-token')
    @ApiResponse({
        status: 201,
        description: 'Refresh token successfully'
    })
    @ApiResponse({
        status: 401,
        description: 'Refresh token failed!'
    })
    refreshToken(@Body() { refresh_token }): Promise<any> {
        console.log('refresh token api');
        return this.authService.refreshToken(refresh_token);
    }

    @UseGuards(AuthGuard)
    @Post('signout')
    signOut(@Req() request: Request): Promise<any> {
        const user = request['user_data']; // Lấy thông tin user từ request
        return this.authService.deleteTokenByUser(user.id);
    }
}
