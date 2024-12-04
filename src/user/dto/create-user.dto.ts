import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
    @ApiProperty()
    first_name: string;
    @ApiProperty()
    last_name: string;
    @ApiProperty()
    @IsNotEmpty()
    @IsEmail()
    email: string;
    @IsNotEmpty()
    @ApiProperty()
    password: string;
    @ApiProperty()
    status: number;
}
