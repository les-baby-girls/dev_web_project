import { Injectable } from '@angular/core';
import { HousingLocation } from './housinglocation';

@Injectable({
  providedIn: 'root'
})
export class HousingService {
  readonly baseUrl = 'https://angular.io/assets/images/tutorials/faa';

  protected housingLocationList: HousingLocation[] = [];


  

  load(): HousingLocation[] {
    fetch('http://post:5000/get/posts').then(
      response => {
        response.json().then(res => {
          if (res.result === "SUCCESS") {
            
            return res.posts;

          } 
        }).catch(e => {})
    }).catch(e => {});
    return []
  }

  async getAllHousingLocations(): Promise<any> {
    const data = await fetch("http://post:5000/get/posts");
    return await data.json() ?? [];
  }

  async getHousingLocationById(id: string): Promise<any> {
    const data = await fetch(`http://post:5000/get/post/${id}`);
    return await data.json() ?? {};
  }
}
