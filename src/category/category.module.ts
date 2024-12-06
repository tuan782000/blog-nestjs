import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { Category } from './entities/category.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Category]), ConfigModule],
    controllers: [CategoryController],
    providers: [CategoryService]
})
export class CategoryModule {}
