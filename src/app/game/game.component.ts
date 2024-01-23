import { Component, OnInit, inject } from '@angular/core';
import { Firestore, collection, doc, onSnapshot, updateDoc } from '@angular/fire/firestore';
import { CommonModule, NgIf } from '@angular/common';
import { Game } from '../../models/game';
import { PlayerComponent } from '../player/player.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
import { MatDialogModule } from '@angular/material/dialog';
import { GameRulesComponent } from '../game-rules/game-rules.component';
import { ActivatedRoute } from '@angular/router';
import { EditPlayerComponent } from '../edit-player/edit-player.component';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [CommonModule, PlayerComponent, MatButtonModule, MatIconModule, MatDialogModule, GameRulesComponent, NgIf],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss'
})
export class GameComponent implements OnInit {
  firestore: Firestore = inject(Firestore); // Firebase mit Projekt verknüpfen
  game!: Game;
  gameId: string | any;
  gameOver = false;

  constructor(private route: ActivatedRoute, public dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.newGame();
    this.route.params.subscribe((params) => {
      this.gameId = params['id'];

      const gameDoc = doc(collection(this.firestore, 'games'), this.gameId);
      onSnapshot(gameDoc, (doc) => {
        if (doc.exists()) {
          let docData: any = doc.data();
          this.game.players = docData['players'];
          this.game.playerImages = docData['playerImages'];
          this.game.stack = docData['stack'];
          this.game.playedCards = docData['playedCards'];
          this.game.currentPlayer = docData['currentPlayer'];
          this.game.pickCardAnimation = docData['pickCardAnimation'];
          this.game.currentCard = docData['currentCard'];
        } else {
          console.log('No such document!');
        }
      });
    });
  }

  newGame() {
    this.game = new Game();
  }

  takeCard() {
    if(this.game.stack.length == 0) {
      this.gameOver = true;
    } else if (!this.game.pickCardAnimation) {
      this.game.currentCard = this.game.stack.pop();
      this.game.pickCardAnimation = true;
      this.game.currentPlayer = (this.game.currentPlayer + 1) % this.game.players.length;
      this.updateGame();

      setTimeout(() => {
        this.game.playedCards.push(this.game.currentCard!);
        this.game.pickCardAnimation = false;
        this.updateGame();
      }, 1000);
    }
  }


  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddPlayerComponent);

    dialogRef.afterClosed().subscribe((name: string) => {
      if (name && name.length > 0) {
        this.game.players.push(name);
        this.game.playerImages.push('profile.png');
        this.updateGame();
      }
    });
  }

  editPlayer(playerId: number) {
    const dialogRef = this.dialog.open(EditPlayerComponent);

    dialogRef.afterClosed().subscribe((change: string) => {
      if (change) {
        if (change == 'DELETE') {
          this.game.players.splice(playerId, 1);
          this.game.playerImages.splice(playerId, 1);
        } else {
          this.game.playerImages[playerId] = change;
        }
        this.updateGame();
      }
    });
  }

  updateGame() {
    let docRef = doc(collection(this.firestore, 'games'), this.gameId);
    updateDoc(docRef, this.game.toJson());
  }
}