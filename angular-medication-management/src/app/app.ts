import { Component, signal } from '@angular/core';
import { MedicationOrder } from "./features/medication-order/medication-order";
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  imports: [MedicationOrder, ReactiveFormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('angular-medication-management');
}
