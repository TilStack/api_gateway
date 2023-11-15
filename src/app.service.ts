import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreateOrderRequest } from './models/dto/order.dto';
import { ClientKafka } from '@nestjs/microservices';
import { OrderCreatedEvent } from './models/events/order_created.event';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './models/create-user-request.model';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto, UserDto } from './models/dto/user.dto';
import { UserCreatedEvent } from './models/events/user_created.event';
import { GetUserRequest } from './models/events/get_user.event';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AppService {
  constructor(
    @Inject('BILLING_SERVICE') private readonly billingClient:ClientKafka,
    @Inject('AUTH_SERVICE') private readonly authClient:ClientKafka,
    private jwtService:JwtService,
    @InjectRepository(User)private readonly userRepo:Repository<User>
    ){}

  getHello(): string {
    return 'Hello World!';
  }

  createOrder({userId,price}:CreateOrderRequest){
    this.billingClient.emit('order_created',new OrderCreatedEvent('123',userId,price))
  }

  async createUser(createUserDto: UserDto) {
    try {     

        console.log(createUserDto)
      const user: any = await firstValueFrom(this.authClient
        .send('create_user', createUserDto));
        console.log(JSON.stringify(user))
  
      if (user) {      
        const user1 = new User(); // Créez une nouvelle instance d'entité User
        user1.name = user.name;
        user1.email = user.email;
        user1.phoneNumber = user.phoneNumber;
        user1.password = user.password;
        const savedUser = await this.userRepo.save(user1);
        return savedUser;
      } else {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
    } catch (error) {
      console.log(error);
      throw new HttpException('An error occurred', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  

  async validatedUser(username:string,password:string){
    try {
      const user = await this.userRepo.findOne({where:{email:username}})  
      if (user && (await bcrypt.compare(password, user.password))) {
        const { password, ...result } = user
        return result
      } else {
        throw new HttpException('Username or password incorrect', HttpStatus.NOT_FOUND)
      }    
    } catch (error) {
      console.log(error)
      throw new HttpException('...', HttpStatus.BAD_REQUEST)
    }
  }

  async login(user:User){
    try {
      const payload={
        username:user.email,
        sub:{
          name:user.name
        }
      }
      return {
        accessToken:this.jwtService.sign(payload),        
      }
    } catch (error) {
      console.log(error)
      throw new HttpException('Error', HttpStatus.BAD_REQUEST)
    }
  }  
  
  async refreshToken(user:User){
    try {
        const payLoad={
            username:user.email,
            sub:{
                phone:user.phoneNumber
            }            
        };
        return {
            ...user,
            accessToken: this.jwtService.sign(payLoad),
        };
    } catch (error) {
        // Capturer l'erreur et renvoyer une exception HTTP
        throw new HttpException('Error during token refresh', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getUserInfo(token: string) {
    try {
      const user = await this.authClient
        .send('get_userInfo', new GetUserRequest(token))
        .toPromise();
  
      if (user) {
        console.log(user);
        return user;
      } else {
        // Traitez le cas où l'utilisateur n'a pas été trouvé
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
    } catch (error) {
      console.log(error);
      throw new HttpException('An error occurred', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async updateUser(token:string,updateUserDto:UpdateUserDto){
  }
}