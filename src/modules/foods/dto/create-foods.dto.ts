import { IsBoolean, IsEmail, IsEnum, IsNumber, isNumber, IsOptional, IsString } from 'class-validator'
import { FoodType } from '@prisma/client'

export class CreateFoodsDto {

    @IsString()
    title!: string

    @IsString()
    subtitle!: string

    @IsNumber()
    price!: number

    @IsNumber()
    stock!: number

    @IsEnum(FoodType)
    type!: FoodType
    
    @IsOptional()
    @IsString()
    description?: string
}

