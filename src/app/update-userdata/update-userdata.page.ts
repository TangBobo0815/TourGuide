import { Component, OnInit } from '@angular/core';
import { UserDateService } from '../services/user-date.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-update-userdata',
  templateUrl: './update-userdata.page.html',
  styleUrls: ['./update-userdata.page.scss'],
})
export class UpdateUserdataPage implements OnInit {
  editState:boolean = false;

  constructor( public authData:UserDateService) { }

  ngOnInit() {
  }

  change(){
    this.editState=true;
  }
}
