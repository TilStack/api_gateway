import { IsEmail, IsNotEmpty, IsPhoneNumber, IsString } from "class-validator";
import { PartialType } from "@nestjs/mapped-types";

export class UserDto{
    @IsNotEmpty()
    @IsString()
    name:string

    @IsNotEmpty()
    @IsEmail()
    email:string

    @IsNotEmpty()
    @IsPhoneNumber()
    phoneNumber:string

    @IsNotEmpty()
    @IsString()
    password:string
}

export class UpdateUserDto extends PartialType(UserDto){}