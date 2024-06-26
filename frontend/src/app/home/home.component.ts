import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HousingLocationComponent } from '../housing-location/housing-location.component';
import { HousingLocation } from '../housinglocation';
import { HousingService } from '../housing.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    HousingLocationComponent
  ],
  template: `
    <section>
    <form>
      <input type="text" placeholder="Filter by city">
      <button class="primary" type="button">Search</button>
    </form>
  </section>
  <section class="results">
  <app-housing-location
    *ngFor="let housingLocation of housingLocationList"
    [housingLocation]="housingLocation"
    (click)="goToImageDetail(housingLocation.post_id)">
  </app-housing-location>
  
</section>
  `,
  styleUrls: ['./home.component.css'],
})

export class HomeComponent {
  housingLocationList: HousingLocation[] = [];
  housingService: HousingService = inject(HousingService);

  constructor(private router: Router) {
    this.housingService.getAllHousingLocations().then((housingLocationList: any) => {
      if (housingLocationList.result === "SUCCESS") this.housingLocationList = housingLocationList.posts;
      else this.housingLocationList = [];
    })
  }

  

  goToImageDetail(id: string) {
    this.router.navigate(['/image', id]);
  }
}
