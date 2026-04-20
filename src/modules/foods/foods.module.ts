import { Module } from '@nestjs/common';
import { FoodsService } from './foods.services';
import { FoodsController } from './foods.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [FoodsController],
    providers: [FoodsService],
    exports: [FoodsService],
})
export class FoodsModule { }
