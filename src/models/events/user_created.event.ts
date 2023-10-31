export class UserCreatedEvent {
    constructor(
        public readonly name:string, 
        public readonly email:string,
        public readonly phoneNumber:string,
        public readonly password:string) {        
    }

    toString(){
        return JSON.stringify({
            name:this.name,
            email:this.email,
            phoneNumber:this.phoneNumber,
            password:this.password
        })
    }
}