import { FoodType } from '@prisma/client'
import { Type } from 'class-transformer'
import { IsOptional, IsString, IsNumber, IsEnum } from 'class-validator'

export class FilterFoodDto {
    @IsOptional()
    @IsString()
    subtitle?: string

    @IsOptional()
    @IsEnum(FoodType)
    type?: FoodType

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    minPrice?: number

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    maxPrice?: number

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    page?: number

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    limit?: number
}