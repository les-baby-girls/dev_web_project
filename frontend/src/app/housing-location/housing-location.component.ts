import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HousingLocation } from '../housinglocation';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-housing-location',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  template: `
    <section class="listing">
      <img class="listing-photo" [src]="housingLocation.image" alt="Exterior photo of {{housingLocation.titre}}">
      <h2 class="listing-heading">{{ housingLocation.titre }}</h2>
      <p class="listing-location">{{ housingLocation.description}}, {{housingLocation.date }}</p>
    </section>
  `,
  styleUrls: ['./housing-location.component.css'],
})

export class HousingLocationComponent {

  @Input() housingLocation!: HousingLocation;

}
