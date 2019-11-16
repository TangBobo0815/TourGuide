import { Component, OnInit } from '@angular/core';
import { IonicRatingModule } from "ionic4-rating";
import { StarRatingModule } from 'ionic4-star-rating';
import { PackageService } from '../services/package.service';

@Component({
  selector: 'app-star',
  templateUrl: './star.page.html',
  styleUrls: ['./star.page.scss'],
})

export class StarPage implements OnInit {

  constructor( 
    private rating: StarRatingModule,
    private packageservice: PackageService        
  ) { }

  logRatingChange(rating){
    console.log("star: ",rating);
  }
  

  ngOnInit() {
  }
}


