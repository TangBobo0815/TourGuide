import { Injectable } from '@angular/core';

export interface Package {
  uid:string;
  title:string;
  address?:string;
  date?:string;
  email?:string;
  gender?:string;
  phone?:string;
  touron:boolean;
  imgsrc?:string;
}

@Injectable({
  providedIn: 'root'
})
export class PackageService {

  constructor() { }
}
