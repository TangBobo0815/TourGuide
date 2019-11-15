import { AngularFirestore, DocumentReference } from 'angularfire2/firestore';

export interface Attend {
    status:boolean,
    userName:string;
    userId:DocumentReference;
  }