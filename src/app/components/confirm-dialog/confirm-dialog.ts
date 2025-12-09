import {Component, inject} from '@angular/core';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent, MatDialogTitle
} from '@angular/material/dialog';
import {MatButton} from '@angular/material/button';

@Component({
  selector: 'app-confirm-dialog',
  imports: [
    MatDialogActions,
    MatDialogContent,
    MatButton,
    MatDialogTitle
  ],
  templateUrl: './confirm-dialog.html',
  styleUrl: './confirm-dialog.css',
})
export class ConfirmDialog {
  private dialogRef = inject(MatDialogRef<ConfirmDialog>)
  public data = inject(MAT_DIALOG_DATA);

  confirm() {
    this.dialogRef.close(true);
  }

  cancel() {
    this.dialogRef.close(false)
  }

  protected readonly onclose = onclose;
}
