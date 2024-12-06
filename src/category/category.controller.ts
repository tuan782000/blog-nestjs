import { AuthGuard } from 'src/auth/auth.guard';
import { CategoryService } from './category.service';
import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    Query,
    Req,
    UseGuards,
    UsePipes,
    ValidationPipe
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Category } from './entities/category.entity';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ApiQuery } from '@nestjs/swagger';
import { FilterCategoryDto } from './dto/filter-category.dto';

@Controller('categories')
export class CategoryController {
    constructor(private categoryService: CategoryService) {}
    @UseGuards(AuthGuard)
    @UsePipes(ValidationPipe)
    @Post()
    create(@Body() createCategoryDto: CreateCategoryDto): Promise<Category> {
        return this.categoryService.create(createCategoryDto);
    }

    @UseGuards(AuthGuard)
    @ApiQuery({ name: 'page' })
    @ApiQuery({ name: 'items_per_page' })
    @ApiQuery({ name: 'search' })
    @Get()
    findAll(@Query() query: FilterCategoryDto): Promise<Category[]> {
        // console.log(query);
        return this.categoryService.findAll(query);
    }

    // lấy ra 1 user chi tiết - phải kèm id - dựa vào id để query database
    @UseGuards(AuthGuard) // lúc này api này đã thành private
    @Get(':id')
    findOne(@Param('id') id: string): Promise<Category> {
        return this.categoryService.findOne(Number(id));
    }

    @UseGuards(AuthGuard) // chuyển thành api private
    // type hàm này Promise<UpdateResult>
    @Put(':id')
    update(
        @Body() updateCategoryDto: UpdateCategoryDto,
        @Param('id') id: string
    ) {
        return this.categoryService.update(Number(id), updateCategoryDto);
    }

    @UseGuards(AuthGuard)
    @Delete(':id')
    delete(@Param('id') id: string) {
        return this.categoryService.delete(Number(id));
    }
}
