
import { Order } from "src/models/create-order-request.model";
import { User } from "src/models/create-user-request.model";
import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";

const config:PostgresConnectionOptions={
    type:"postgres",
    database:"gatewaydb",
    host:"postgres_container",  
    port:5432,
    username:"postgres",
    password:"postgres",
    entities:{User,Order},
    synchronize:true
}

export default config