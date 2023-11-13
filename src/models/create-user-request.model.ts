import { Column, Entity, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { Order } from "./create-order-request.model";
import { IsOptional } from "class-validator";

@Entity()
export class User{    
    @PrimaryGeneratedColumn('uuid')
    id:string

    @Column({nullable:false, unique:true})
    email:string

    @Column({nullable:false})
    name:string

    @Column({nullable:false})
    password:string

    @Column({nullable:false, unique:true})
    phoneNumber:string

    @Column({nullable:true})
    @IsOptional()
    imageUrl:string;

    @OneToMany(()=>Order,(order)=>order.user)
    orders?:Order[]
}