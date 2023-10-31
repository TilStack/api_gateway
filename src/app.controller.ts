import { Body, Controller, Get, HttpException, HttpStatus, Inject, OnModuleInit, Post,Request, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { CreateOrderRequest } from './models/dto/order.dto';
import { UserDto } from './models/dto/user.dto';
import { LocalAuthGuard } from './guards/local-jwt.guards';
import { ClientKafka } from '@nestjs/microservices';

@Controller('api')
export class AppController implements OnModuleInit{
  constructor(private readonly appService: AppService, @Inject('AUTH_SERVICE') private readonly authClient:ClientKafka,) {}
  onModuleInit() {
    this.authClient.subscribeToResponseOf('create_user')
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post()
  async createOrder(@Body() createOrdeRequest:CreateOrderRequest){
    await this.appService.createOrder(createOrdeRequest)
  }
  
  @Post('user/register')
  async createUser(@Body() createUserRequest:UserDto){
    const user=await this.appService.createUser(createUserRequest)
    return user
  }

  @UseGuards(LocalAuthGuard)
  @Post('user/login')
  async Login(@Request() req){
    await this.appService.createUser(req.user)
  }

  @Get('user/info')
  async getUserInfo(@Request() req){
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer ')){
      const token= req.headers.authorization.split(' ')[1]
      const user= await this.appService.getUserInfo(token)

      if(user){
        return user
      } else {
        throw new HttpException('Utilisateur non trouvé',HttpStatus.NOT_FOUND)
      }
    }
  }
}
