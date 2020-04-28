import { Component, Inject, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators';

import { GameService } from './game.service';

export class Game {
  _id?: string;
  name: string;
  description: string;
  gameRooms: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  games: Game[];
  isLoading = false;

  newGame: Game;
  displayNewGame = false;

  gameRooms: string = 'test';
  description: string =
    'Wizzard ist ein Kartenspiel.\n' +
    'Es müssen in bis zu 17 runden Stiche geraten werden.\n' +
    'Die Spielfauer ist etwa 30 Minuten pro Runde.';

  constructor(private gameService: GameService) {}

  ngOnInit() {
    this.isLoading = true;
    this.loadGames();
  }

  addGameCard() {
    this.displayNewGame = true;
    this.loadGames();
  }

  saveGame() {
    this.gameService.createContact(this.newGame);
    this.loadGames();
  }

  hideNewGame() {
    this.displayNewGame = false;
  }

  editGame(game: Game) {
    this.gameService.updateGame(game);
    this.loadGames();
  }

  loadGames() {
    this.gameService.getGames().subscribe((games) => {
      this.isLoading = false;
      this.games = games;
    });
  }
}
