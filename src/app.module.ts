import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { AppController } from './app.controller'
import { AppService } from './app.service'

import { PrismaModule } from './prisma/prisma.module'
import { UsersModule } from './users/users.module'
import { AuthModule } from './modules/auth/auth.module'
import { FoodsModule } from './modules/foods/foods.module'

import { LoggerModule } from './common/logger/logger.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    LoggerModule,

    PrismaModule,
    UsersModule,
    AuthModule,
    FoodsModule,
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}