import { Global, Module } from '@nestjs/common'
import { ClientsModule, Transport } from '@nestjs/microservices'

@Global()
@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'LOG_SERVICE',
        transport: Transport.TCP,

        options: {
          host: 'localhost',
          port: 3001,
        },
      },
    ]),
  ],

  exports: [ClientsModule],
})
export class LoggerModule {}