import { Component, Inject, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators';

import { GameService } from './game.service';
import { CredentialsService } from '@app/auth';

export class Game {
  _id?: string;
  name: string;
  description: string;
  gameRooms: string;
  committed?: string[];
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  games: Game[];
  isLoading = false;

  newGame: Game = new Game();
  displayNewGame = false;

  constructor(private gameService: GameService, private credentialsService: CredentialsService) {}

  ngOnInit() {
    this.isLoading = true;
    this.loadGames();
  }

  addGameCard() {
    this.displayNewGame = true;
    this.loadGames();
  }

  saveGame() {
    this.gameService.createGame(this.newGame).subscribe(() => {
      this.displayNewGame = false;
      this.newGame = new Game();
      this.loadGames();
    });
  }

  hideNewGame() {
    this.displayNewGame = false;
    this.newGame = new Game();
  }

  editGame(game: Game) {
    this.gameService.updateGame(game).subscribe(() => {
      this.loadGames();
    });
  }

  loadGames() {
    this.gameService.getGames().subscribe((games) => {
      this.isLoading = false;
      console.log(games);
      this.games = games.sort((a, b) => a.name.localeCompare(b.name, 'de-DE'));
      console.log(this.games);
    });
  }

  commitToGame(game: Game) {
    this.gameService.commitToGame(game._id, this.credentialsService.credentials.username).subscribe(() => {
      this.loadGames();
    });
  }

  uncommitToGame(game: Game) {
    this.gameService.uncommitToGame(game._id, this.credentialsService.credentials.username).subscribe(() => {
      this.loadGames();
    });
  }

  isCommitted(game: Game) {
    if (!game?.committed || game.committed === []) {
      return false;
    }
    return game.committed.includes(this.credentialsService.credentials.username);
  }
}
