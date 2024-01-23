import { Component } from '@angular/core';
import { NgForOf } from '@angular/common';
import { MatDialogModule, MatDialogClose, MatDialogRef } from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';

@Component({
  selector: 'app-edit-player',
  standalone: true,
  imports: [NgForOf,
    MatDialogModule,
    MatDialogClose,
    MatButtonModule
  ],
  templateUrl: './edit-player.component.html',
  styleUrl: './edit-player.component.scss'
})
export class EditPlayerComponent {

  constructor(
    public dialogRef: MatDialogRef<EditPlayerComponent>
  ) { }

  allProfilePictures = ['profile.png', 'female.png'];

}
