export class User {
    uid?:string;
    email?: string;
    Name?: string;
    gender?:string;
    date?:Date;
    country?:string;
    phone?:string;
    address?:string;
    userImg?:string;
    userImgRef?:string;
    //-----------
    // touron?:boolean;
    touron?:string;
    imgsrc?:string;
    fileRef?:string;
    userid?:string;

    // get e164(){
    //     const num = this.country + this.phone
    //     return `+${num}`
    // }
}