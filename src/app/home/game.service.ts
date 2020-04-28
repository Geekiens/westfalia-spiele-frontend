import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Game } from '@app/home/home.component';

const routes = {
  quote: (c: RandomQuoteContext) => `/jokes/random?category=${c.category}`,
};

export interface RandomQuoteContext {
  // The quote's category: 'dev', 'explicit'...
  category: string;
}

@Injectable({
  providedIn: 'root',
})
export class GameService {
  constructor(private httpClient: HttpClient) {}

  getGames(): Observable<Game[]> {
    const game = { id: 1, name: 'Wizzard', description: 'desc', gameRooms: 'gr' };

    /*
    return this.httpClient.get(routes.quote()).pipe(
      map((body: any) => body.value),
      catchError(() => of('Error, could not load joke :-('))
    );

     */
    return of([game]);
  }
}
