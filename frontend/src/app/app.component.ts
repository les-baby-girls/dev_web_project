import { Component, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterModule
  ],
  template: `
    <main>
      <a [routerLink]="['/']">
        <header class="brand-name">
          <img class="brand-logo" src="/assets/Pinterest2_Logo.svg.png" alt="logo" aria-hidden="true">
          <button class="connect-button" type="button" (click)="redirectToLoginPage()">Se connecter</button>
        </header>
      </a>
      <p> BUENOS DIAS </p>
      <section class="content">
        <router-outlet></router-outlet>
      </section>
    </main>
  `,
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'home';

  constructor(private router: Router) {}

  ngOnInit() {
  }

  fetchUser() {
    fetch('http://localhost:3000/utilisateur-connecte')
      .then(response => {
        response.json().then(data => {
        const userContainer = document.getElementById('username-container');
        console.log(data)
        if (userContainer) { // Check if userContainer is not null
          console.log(data.username)
          if (data.username) {
            userContainer.innerText = `Utilisateur connecté : ${data.username}`;
          } else {
            userContainer.innerText = `Utilisateur connecté : ${data}`;
          }
        }
      })
    })
      .catch(error => {
        console.error('Erreur lors de la récupération de l\'utilisateur connecté :', error);
        const userContainer = document.getElementById('username-container');
        if (userContainer) { // Check again in case of an error
          userContainer.innerText = "Erreur lors de la connexion";
        }
      });
  }

  redirectToLoginPage() {
    window.location.href = 'http://localhost:3000';
  }
}
