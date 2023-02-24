import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { Subscription } from 'rxjs';

interface Response {
  count?: number;
  next?: string | null;
  prevous?: string | null;
  results?: {name: string, url: string}[];
}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'angular-unsubscribe-duplicate-hit-endpoint';
  URL = 'https://pokeapi.co/api/v2/pokemon';
  dataPokemon?: {name: string, url: string}[] = [];
  pokemonSubscribe$!: Subscription;
  limit = 10;

  constructor(private httpClient: HttpClient) {}

  requestApi(): void {
    for (let index = 0; index < this.limit; index++) {
      if (this.pokemonSubscribe$) {
        this.pokemonSubscribe$.unsubscribe();
      }
      this.doHitEndpoint(this.limit, 0);
    }
  }

  doHitEndpoint(limit: number, offset: number) {
    this.pokemonSubscribe$ = this.httpClient.get(this.URL + `?limit=${limit}&offset=${offset}`).subscribe((response: Response) => {
      if (response.results) {
        this.dataPokemon = response!.results;
      }
    }, (err: HttpErrorResponse) => {
      console.log(err, 'error');
    })
  }

  resetData() {
    this.dataPokemon = [];
  }
}
