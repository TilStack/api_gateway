import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { AppService } from "src/app.service";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy){
    constructor(private authService:AppService){
        super()
    }

    async validate(username:string,password:string){
        const user=await this.authService.validatedUser(username,password)
        if(!user){
            throw new UnauthorizedException() 
        }
        return user
    }
}