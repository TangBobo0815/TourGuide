import { AbstractControl } from '@angular/forms';

export class IdValidator {
  static MatchId(ac: AbstractControl) {
    let id = ac.get('userid').value;
    let gender =ac.get('gender').value;
    console.log(gender);
    let s;

    if( gender =='男'){
        s = id.charAt(2);
        if(s=='1'){
            return {matchId :true};
        }else{
            return {matchId :false};
        }
    }else if (gender == '女'){
        s.id.charAt(2);
        if(s=='2'){
            return  {matchId :true};
        }else{
            return  {matchId :false};
        }
    }else{
        return  {matchId :false};
    }
  }
  
}