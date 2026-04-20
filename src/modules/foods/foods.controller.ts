import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { FoodsService } from './foods.services';
import { CreateFoodsDto } from './dto/create-foods.dto';
import { UpdateFoodsDto } from './dto/update-foods.dto';
import { AccessJwtGuard } from 'src/common/guards/access.jwt.guard';
import { FilterFoodDto } from './dto/filter-foods.dto';

@Controller('foods')
export class FoodsController {
    constructor(private readonly foodService: FoodsService) { }

    @Post()
    create(@Body() createFoodDto: CreateFoodsDto) {
        console.log("Test", createFoodDto)
        console.log("BODY:", createFoodDto)
        console.log("TYPE:", typeof createFoodDto)
        return this.foodService.create(createFoodDto)
    }

    @Get()
    // @UseGuards(AccessJwtGuard)
    findAll(@Query() query: FilterFoodDto) {
        return this.foodService.findAll(query);
    }

    @Get(':id')
    // @UseGuards(AccessJwtGuard)
    findOne(@Param('id') id: number) {
        return this.foodService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id') id: number, @Body() updateFoodDto: UpdateFoodsDto) {
        return this.foodService.update(id, updateFoodDto);
    }

    @Delete(':id')
    remove(@Param('id') id: number) {
        return this.foodService.remove(id);
    }

}
