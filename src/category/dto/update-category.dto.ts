import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class UpdateCategoryDto {
    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    description: string;

    status: number;
}
