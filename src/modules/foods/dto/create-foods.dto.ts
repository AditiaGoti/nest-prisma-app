import { IsBoolean, IsEmail, IsEnum, IsNumber, isNumber, IsOptional, IsString } from 'class-validator'
import { FoodType } from '@prisma/client'
import { Type } from 'class-transformer'

export class CreateFoodsDto {

    @IsString()
    title!: string

    @IsString()
    subtitle!: string

    @Type(() => Number)
    @IsNumber()
    price!: number

    @Type(() => Number)
    @IsNumber()
    stock!: number

    @IsEnum(FoodType)
    type!: FoodType

    @IsOptional()
    @IsString()
    description?: string

    @IsOptional()
    @IsString()
    imageUrl?: string
}

