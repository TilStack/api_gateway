import { Body, Controller, Get, HttpException, HttpStatus, Inject, 
  OnModuleInit, Post,Request, UseGuards, UploadedFile, UseInterceptors, 
  BadRequestException, Res, Param,Put } from '@nestjs/common';
import { AppService } from './app.service';
import { CreateOrderRequest } from './models/dto/order.dto';
import { UserDto,UpdateUserDto } from './models/dto/user.dto';
import { LocalAuthGuard } from './guards/local-jwt.guards';
import { FileInterceptor } from '@nestjs/platform-express';
import { ClientKafka } from '@nestjs/microservices';
import { diskStorage } from 'multer';
import { JwtAuthGuard } from './guards/jwt-auth.guards';
import { JwtStrategy } from './strategy/jwt-strategy';
import { startWith } from 'rxjs';

@Controller('')
export class AppController implements OnModuleInit{
  constructor(private readonly appService: AppService, @Inject('AUTH_SERVICE') private readonly authClient:ClientKafka,@Inject(JwtStrategy) private readonly jwtStrategy: JwtStrategy) {}
  onModuleInit() {
    this.authClient.subscribeToResponseOf('create_user'),
    this.authClient.subscribeToResponseOf('update_user')
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
    return await this.appService.login(req.user)
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

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', {
      storage: diskStorage({
          destination: './uploads/profile',
          filename: (req, file, cb) => {
              const name = file.originalname.split('.')[0];
              const fileExtension = file.originalname.split('.')[1];
              const newFilename = name.split(' ').join('_') + '_' + Date.now() + '.' + fileExtension;
              cb(null, newFilename);
          },
      }),
      fileFilter: (req, file, cb) => {
          if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
              return cb(null, false);
          }

          cb(null, true);
      },
  }))
  async upload(@UploadedFile() file: Express.Multer.File) {
      if (!file) {
          throw new BadRequestException('File is not an image');
      } else {
          const response = {
              filepath: `http://localhost:3100/user/profile/${file.filename}`,
          };
          return response;
      }
  }


  @UseGuards(JwtAuthGuard)
  @Put('user/update')
  async updateUser(@Request() req,@Body() userDto:UpdateUserDto){
    if(req.headers.authorization && req.headers.authorization.startWith('Bearer ')){
      const token=req.headers.authorization.split(' ')[1]
      const user= await this.appService.updateUser(token,userDto)
    }else{
      throw new HttpException('Erreur de la modification',HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
  
}
