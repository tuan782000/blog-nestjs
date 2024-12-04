import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { RegisterUserDto } from './dto/register-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
    // để mà tương tác db - thông qua repositpory - ở đây tạo constructor
    // Tạo constructor
    constructor(
        @InjectRepository(User) private userRepository: Repository<User>,
        private jwtService: JwtService,
        private configService: ConfigService
    ) {}

    // viết tính năng đăng ký
    // Tính năng này mất thời gian chờ database phải dùng async await
    // 1 Promise là 1 lời hứa đăng ký user này có thể thành công hoặc thất bại
    // mặc dù là không báo public hay private mặc định public
    async register(registerUserDto: RegisterUserDto): Promise<User> {
        const hashPassword = await this.hashPasword(registerUserDto.password);

        return await this.userRepository.save({
            ...registerUserDto,
            refresh_token: 'refresh_token_string',
            password: hashPassword
        }); // refresh_token: đang là tạm thời
    }

    async login(loginUserDto: LoginUserDto): Promise<any> {
        // đi tìm user đó dựa trên email
        // findOne: trả về true hoặc false - tìm thấy true - không thì false
        const user = await this.userRepository.findOne({
            where: {
                email: loginUserDto.email
            }
        });

        // kiểm tra xem kết quả tìm kiếm có hay không - nếu không trả về lỗi
        // nghịch đảo false là true vào trong if ném lỗi về client
        if (!user) {
            throw new HttpException(
                'Email or password is not correct!!!',
                HttpStatus.UNAUTHORIZED // mã 401
            );
        }

        // compareSync đã tích hợp sẵn bất đồng bộ
        // compareSync cũng trả về true false - nếu giống nhau khi đã giải mã thì trả true ngược lại không giống false
        const checkPass = bcrypt.compareSync(
            loginUserDto.password,
            user.password
        );

        // nghịch đảo false -> true vào đây ném lỗi về client
        if (!checkPass) {
            throw new HttpException(
                'Email or password is not correct!!!',
                HttpStatus.UNAUTHORIZED // mã 401
            );
        }

        // khi vượt qua được 2 test về email và password - thì sẽ tạo 2 token refresh token và access token trả về cho client
        // generate token
        const payload = { id: user.id, email: user.email }; // lấy id và email người dùng gửi tổng hợp thành object gán vào payload
        return this.generateToken(payload); // truyền payload này vào hàm generateToken - để rồi nhận về kết qủa { access_token, refresh_token }
    }

    // cái này sẽ dùng để cấp lại 1 accesstoken mới - nếu refresh_token vẫn còn hạn
    async refreshToken(refresh_token: string): Promise<any> {
        try {
            const verify = await this.jwtService.verifyAsync(refresh_token, {
                // secret: '123456'
                secret: this.configService.get<string>('SECRET')
            });
            console.log(verify);

            const checkExistToken = await this.userRepository.findOneBy({
                email: verify.email,
                refresh_token
            });

            if (checkExistToken) {
                // trả về accesstoken mới và refreshtoken mới
                return this.generateToken({
                    id: verify.id,
                    email: verify.email
                });
            } else {
                throw new HttpException(
                    'Refresh token is not valid',
                    HttpStatus.BAD_REQUEST
                );
            }
        } catch (error) {
            throw new HttpException(
                'Refresh token is not valid',
                HttpStatus.BAD_REQUEST
            );
        }
    }

    // viết 1 function riêng để hashed password - sau đó đem vào register dùng
    // vì hashed password là 1 việc làm tốn thời gian nên async await
    // private dùng nội bộ file này thôi
    private async hashPasword(password: string): Promise<string> {
        const saltRound = 10;
        const salt = await bcrypt.genSalt(saltRound);
        const hash = await bcrypt.hash(password, salt);
        return hash;
    }

    // nhận vào 1 payload - mà payload là 1 object bên trong object sẽ có các thuộc tính id: của user, email: của user
    // chú ý: sử dụng thư viện jwt thì phải đăng ký bên module
    private async generateToken(payload: { id: number; email: string }) {
        const access_token = await this.jwtService.signAsync(payload); // đăng ký payload này để tạo thành token
        const refresh_token = await this.jwtService.signAsync(payload, {
            // secret: '123456',
            secret: this.configService.get<string>('SECRET'),
            // expiresIn: '1d',
            expiresIn: this.configService.get<string>('EXP_IN_ACCESS_TOKEN')
        });

        await this.userRepository.update(
            {
                email: payload.email
            },
            {
                refresh_token: refresh_token
            }
        );

        return { access_token, refresh_token };
    }
}
