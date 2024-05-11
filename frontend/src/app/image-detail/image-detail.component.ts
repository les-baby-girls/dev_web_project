import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { HousingService } from '../housing.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-image-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './image-detail.component.html',
  styleUrl: './image-detail.component.css'
})
export class ImageDetailComponent {
  imageUrl: string = '';
  comments: any[] = [];

  constructor(private route: ActivatedRoute, private housingService: HousingService) {}

  ngOnInit() {
    // Récupérer l'ID de l'image depuis les paramètres de la route
    this.route.params.subscribe(params => {
      const id = +params['id'];
      const image = this.housingService.getHousingLocationById(id);
      if (image) {
        this.imageUrl = image.photo;

        // Effectuer la requête HTTP pour récupérer les commentaires
        fetch('http://localhost:8080/comments/' + id).then(response => {
          response.json().then(res => {
            if (res.resultat == "SUCCESS") {
              this.comments = res.ListeComment;
            } 
          })
        });

      }
    });
  }
  
}
