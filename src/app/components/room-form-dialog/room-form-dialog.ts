import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import {RoomState} from '../../models/enums/room-state.model';

@Component({
  selector: 'app-room-form-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './room-form-dialog.html',
  styleUrl: './room-form-dialog.css'
})
export class RoomFormDialog implements OnInit {

  roomForm: FormGroup;
  isEditMode: boolean = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<RoomFormDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.roomForm = this.fb.group({
      id: [null],
      number: ['', Validators.required],
      type: ['', Validators.required],
      name: ['', Validators.required],
      price: [null, [Validators.required, Validators.min(0)]],
      maxGuests: [2, [Validators.required, Validators.min(1)]],
      description: [''],
      state: [RoomState.AVAILABLE, Validators.required]
    });
  }

  ngOnInit(): void {
    if (this.data) {
      this.isEditMode = true;
      this.roomForm.patchValue(this.data);
    }
  }

  save() {
    if (this.roomForm.valid) {
      this.dialogRef.close(this.roomForm.value);
    }
  }

  close() {
    this.dialogRef.close(null);
  }
}
