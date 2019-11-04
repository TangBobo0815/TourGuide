import { Timestamp } from 'rxjs/internal/operators/timestamp';
import { AngularFirestore, DocumentReference } from 'angularfire2/firestore';

export interface Order {
    packageId:string;
    orderTime:Date;
    status:string;
    packUser:string;
    userName:string;
    userId:DocumentReference;
  }