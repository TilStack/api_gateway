export class GetUserRequest{
    constructor (private readonly token:string){}

    toString(){
        return JSON.stringify({
            token:this.token
        })
    }
}