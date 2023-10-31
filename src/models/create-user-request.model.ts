import { Column, Entity, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { Order } from "./create-order-request.model";

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

    @OneToMany(()=>Order,(order)=>order.user)
    orders?:Order[]
}