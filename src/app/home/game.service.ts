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

  createGame(newGame: Game): Observable<Game> {
    console.log(newGame);
    return this.http.post<Game>(this.gamesUrl, newGame);
  }

  updateGame(putGame: Game): Observable<void> {
    const putUrl = this.gamesUrl + '/' + putGame._id;
    return this.http.put<void>(putUrl, putGame);
  }

  commitToGame(id: string, username: string): Observable<void> {
    const commitUrl = this.gamesUrl + '/' + id + '/commit/' + username;
    return this.http.get<void>(commitUrl);
  }

  uncommitToGame(id: string, username: string): Observable<void> {
    const uncommitUrl = this.gamesUrl + '/' + id + '/uncommit/' + username;
    return this.http.get<void>(uncommitUrl);
  }
}
