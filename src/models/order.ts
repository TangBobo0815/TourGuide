import { Timestamp } from 'rxjs/internal/operators/timestamp';

export interface Order {
    packageId:string;
    orderTime:number;
    status:string;
    userId:string;
  }