import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterModule,
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

export class AppComponent {
  title = 'home';

  constructor(private router: Router) {}

  redirectToLoginPage() {
    window.location.href = 'http://localhost:3000';
  }
}