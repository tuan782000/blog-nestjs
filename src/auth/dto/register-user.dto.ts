import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class RegisterUserDto {
    @ApiProperty()
    first_name: string;
    @ApiProperty()
    last_name: string;
    @IsNotEmpty()
    @ApiProperty()
    @IsEmail()
    email: string;
    @IsNotEmpty()
    @ApiProperty()
    password: string;
    status: number;
}
