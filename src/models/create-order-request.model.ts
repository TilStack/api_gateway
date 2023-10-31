import { Column, Entity, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm"
import { User } from "./create-user-request.model"

@Entity()
export class Order{
    @PrimaryGeneratedColumn()
    id:string

    @ManyToOne(()=>User,user=>user.orders)
    user:User

    @Column()
    price:string
    
}