import { IsEmail, IsNotEmpty } from 'class-validator';

export class UpdateUserDto {
    first_name: string;
    last_name: string;
    status: number;
}
