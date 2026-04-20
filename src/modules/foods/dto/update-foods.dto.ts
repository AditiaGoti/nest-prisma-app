import { PartialType } from '@nestjs/mapped-types';
import { CreateFoodsDto } from './create-foods.dto';

export class UpdateFoodsDto extends PartialType(CreateFoodsDto) { }
