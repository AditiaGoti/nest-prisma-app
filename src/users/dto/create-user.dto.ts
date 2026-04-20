import { IsBoolean, IsEmail, IsEnum, IsString } from 'class-validator'
import { AccountType } from '@prisma/client'

export class CreateUserDto {

  @IsString()
  name!: string

  @IsEmail()
  email!: string

  @IsEnum(AccountType)
  jabatan!: AccountType

  @IsBoolean()
  isActive!: boolean

  @IsString()
  password!: string;

}