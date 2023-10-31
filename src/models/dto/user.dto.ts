import { IsEmail, IsNotEmpty, IsPhoneNumber, IsString } from "class-validator";


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