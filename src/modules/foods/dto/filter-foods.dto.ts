import { Type } from 'class-transformer'
import { IsOptional, IsString, IsNumber } from 'class-validator'

export class FilterFoodDto {
    @IsOptional()
    @IsString()
    title?: string

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