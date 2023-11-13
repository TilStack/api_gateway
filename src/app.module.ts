import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';
import config from 'ormconfig';
import { User } from './models/create-user-request.model';
import { JwtModule } from '@nestjs/jwt';
import { LocalStrategy } from './strategy/local-strategy';
import { JwtStrategy } from './strategy/jwt-strategy';
import { Order } from './models/create-order-request.model';

@Module({
  imports: [
    ClientsModule.register([
      {
        name:'BILLING_SERVICE',
        transport:Transport.KAFKA,
        options:{
          client:{
            clientId:'billing',
            brokers:['kafka-2:9092'],
          },
          consumer:{
            groupId:'billing-consumer',
          }
        }
      }
    ]),
    ClientsModule.register([
      {
        name:'AUTH_SERVICE',
        transport:Transport.KAFKA,
        options:{
          client:{
            clientId:'auth',
            brokers:['kafka-2:9092'],
          },
          consumer:{
            groupId:'auth-consumer',
          }
        }
      }
    ]),
    JwtModule.register({
      secret: `${process.env.jwt_secret}`,
      signOptions:{expiresIn:'1d'}
    }),
    TypeOrmModule.forRoot(config),
    TypeOrmModule.forFeature([User,Order])      
  ],
  controllers: [AppController],
  providers: [AppService,LocalStrategy,JwtStrategy,],
})
export class AppModule {}
