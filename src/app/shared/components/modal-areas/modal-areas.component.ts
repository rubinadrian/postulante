import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Area } from '../../../models/interfaces'

@Component({
  selector: 'app-modal-areas',
  templateUrl: './modal-areas.component.html',
  styleUrls: ['./modal-areas.component.css']
})
export class ModalAreasComponent {
    constructor(
      public dialogRef: MatDialogRef<ModalAreasComponent>,
      @Inject(MAT_DIALOG_DATA) public data: Area) {}

    onNoClick(): void {
      this.dialogRef.close();
    }
}
