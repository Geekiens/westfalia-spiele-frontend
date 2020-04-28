import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Game } from '@app/home/home.component';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  private gamesUrl = '/games';

  constructor(private http: HttpClient) {}

  getGames(): Observable<Game[]> {
    return this.http.get<Game[]>(this.gamesUrl);
  }

  createContact(newGame: Game): Observable<void> {
    return this.http.post<void>(this.gamesUrl, newGame);
  }

  updateGame(putGame: Game): Observable<void> {
    const putUrl = this.gamesUrl + '/' + putGame._id;
    return this.http.put<void>(putUrl, putGame);
  }
}
