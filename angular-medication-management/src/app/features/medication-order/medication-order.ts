import { MedicationForm } from '../../core/services/medication-form';
import { HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormArray } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, startWith, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { AbstractControl } from '@angular/forms';
import { of } from 'rxjs';
import { filter, tap } from 'rxjs/operators';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import {
  AVAILABLE_DRUGS,
  ROUTES,
  THERAPY_TYPES,
  DOSAGE_UNITS,
  FREQUENCIES,
  CHEMOTHERAPY_DIAGNOSES,
  PHYSICIAN_GROUP
} from '../../core/data/medication-mock-data';
@Component({
  selector: 'app-medication-order',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatAutocompleteModule, MatSelectModule, MatRadioModule, MatButtonModule, MatCardModule, MatIconModule, MatDatepickerModule, MatNativeDateModule],
  templateUrl: './medication-order.html',
  styleUrl: './medication-order.css',
})

export class MedicationOrder implements OnInit {
  availableDrugs = AVAILABLE_DRUGS;
  routes = ROUTES;
  therapyTypes = THERAPY_TYPES;
  dosageUnits = DOSAGE_UNITS;
  frequencies = FREQUENCIES;
  chemotherapyDiagnoses = CHEMOTHERAPY_DIAGNOSES;
  physicians = PHYSICIAN_GROUP;




  hasUnsavedChanges = false;
  filteredDrugStreams = new Map<string, Observable<string[]>>();
  form!: FormGroup;
  draftKey = 'medication-order-draft';
  lastSavedData: any = null;
  lastSavedTime: string | null = null;
  
  isViewOnly = false;
  isSubmitAttempted = false;
  
  getFilteredDrugs(control: AbstractControl | null): Observable<string[]> {
    if (!control) {
      return of(this.availableDrugs);
    }
    return control.valueChanges.pipe(
      startWith(control.value ?? ''),
      debounceTime(300),
      distinctUntilChanged(),
      map(value => (value ?? '').toString().toLowerCase()),
      map(search =>
        this.availableDrugs.filter(drug =>
          drug.toLowerCase().includes(search)
        )
      )
    );
  }


  constructor(private medicationFormService: MedicationForm) { }

  ngOnInit(): void {
    this.form = this.medicationFormService.createMedicationOrderForm();
    this.medications.controls.forEach(group => {
      const drugControl = group.get('drugName');
      if (drugControl) {
        // Revalidate FormArray when drug changes
        drugControl.valueChanges.subscribe(() => {
          this.medications.updateValueAndValidity();
          this.medications.markAsTouched();
        });
        const stream = drugControl.valueChanges.pipe(
          startWith(''),
          debounceTime(300),
          distinctUntilChanged(),
          map(value => (value ?? '').toString().toLowerCase()),
          map(search =>
            this.availableDrugs.filter(drug =>
              drug.toLowerCase().includes(search)
            )
          )
        );
        this.filteredDrugStreams.set(group.value.id, stream);
      }
    });
    this.form.statusChanges.subscribe(status => {
      console.log('Form Status:', status);
    });
    this.form.valueChanges.subscribe(value => {
      console.log('Form Value Changed:', value);
      console.log('Form Valid:', this.form.valid);
    });
    this.form.valueChanges.subscribe(() => {
      this.hasUnsavedChanges = this.form.dirty;
      this.logDirtyControls(this.form);
    });
    this.form.valueChanges.pipe(
      debounceTime(5000),
      filter(() => this.form.dirty && this.form.valid),
      tap(() => {
        const data = this.form.getRawValue();
        localStorage.setItem(this.draftKey, JSON.stringify(data));
        this.lastSavedData = data;
        this.lastSavedTime = new Date().toLocaleTimeString();

        console.log('Draft Auto-Saved');
      })
    ).subscribe();
  }

  // Getter for medications FormArray
  get medications(): FormArray {
    return this.form.get('medications') as FormArray;
  }

  @HostListener('window:beforeunload', ['$event'])
  confirmLeave($event: BeforeUnloadEvent) {

    if (this.form.dirty) {
      $event.preventDefault();
      $event.returnValue = true;
    }

  }

  addMedication() {
    if (this.medications.length >= 10) return;
    const group = this.medicationFormService.createMedicationGroup();
    this.medications.push(group);
    const drugControl = group.get('drugName');
    if (drugControl) {
      //  Revalidate FormArray immediately when drug changes
      drugControl.valueChanges.subscribe(() => {
        this.medications.updateValueAndValidity();
        this.medications.markAsTouched();
      });
      const stream = drugControl.valueChanges.pipe(
        startWith(''),
        debounceTime(300),
        distinctUntilChanged(),
        map(value => (value ?? '').toString().toLowerCase()),
        map(search =>
          this.availableDrugs.filter(drug =>
            drug.toLowerCase().includes(search)
          )
        )
      );
      this.filteredDrugStreams.set(group.value.id, stream);
      drugControl.valueChanges.subscribe((drugName) => {
        if (!drugName) return;
        console.log("Checking drug existence...");
        setTimeout(() => {
          const existingDrug = this.existingDrugDatabase.find(
            d => d.name.toLowerCase() === drugName.toLowerCase()
          );
          if (existingDrug) {
            drugControl.setErrors({
              drugExists: {
                name: existingDrug.name,
                id: existingDrug.id
              }
            });
            console.log("Drug already exists:", existingDrug);
          } else {
            if (drugControl.hasError('drugExists')) {
              drugControl.setErrors(null);
            }
          }
        }, 2000);
      });
    }
    this.medications.updateValueAndValidity();
  }

  removeMedication(index: number) {
    if (this.medications.length === 1) return;
    const medicationToRemove = this.medications.at(index);
    console.log('Removing Medication:', medicationToRemove.getRawValue());
    this.medications.removeAt(index);
  }
  logDirtyControls(group: any, path: string = '') {
    Object.keys(group.controls).forEach(key => {
      const control = group.controls[key];
      const currentPath = path ? `${path}.${key}` : key;
      if (control.dirty) {
        console.log('Modified Field:', currentPath);
      }
      if (control.controls) {
        this.logDirtyControls(control, currentPath);
      }
    });
  }
  saveDraft() {
    const data = this.form.getRawValue();
    localStorage.setItem(this.draftKey, JSON.stringify(data));
    this.lastSavedData = data;
    console.log("Draft Saved Manually");

  }
  restoreDraft() {
    const saved = localStorage.getItem(this.draftKey);
    if (!saved) return;
    const parsed = JSON.parse(saved);
    // Reset first
    this.form.reset();
    // Patch non-array fields
    this.form.patchValue({
      patientInfo: parsed.patientInfo,
      prescribingInfo: parsed.prescribingInfo
    });
    // Rebuild medications
    this.medications.clear();
    parsed.medications.forEach((med: any) => {
      const group = this.medicationFormService.createMedicationGroup();
      group.patchValue(med);
      this.medications.push(group);
    });
    this.form.markAsPristine();
    console.log('Draft Restored');

    //-------------------By using service method ---------------------------------------------------------------
    // const saved = localStorage.getItem(this.draftKey);
    // if (!saved) return;
    // const parsed = JSON.parse(saved);
    // this.medicationFormService.populateFromExisting(this.form, parsed);
    // //  Rebuild autocomplete streams
    // this.filteredDrugStreams.clear();
    // this.medications.controls.forEach(group => {
    //   const drugControl = group.get('drugName');
    //   if (drugControl) {
    //     drugControl.valueChanges.subscribe(() => {
    //       this.medications.updateValueAndValidity();
    //     });
    //     const stream = drugControl.valueChanges.pipe(
    //       startWith(drugControl.value ?? ''),
    //       debounceTime(300),
    //       distinctUntilChanged(),
    //       map(value => (value ?? '').toString().toLowerCase()),
    //       map(search =>
    //         this.availableDrugs.filter(drug =>
    //           drug.toLowerCase().includes(search)
    //         )
    //       )
    //     );
    //     this.filteredDrugStreams.set(group.value.id, stream);
    //   }
    // });
    // this.form.markAsPristine();
    // this.lastSaved = new Date().toLocaleTimeString();
    // console.log('Draft Restored');
  }
  toggleViewOnly() {
    this.isViewOnly = !this.isViewOnly;
    if (this.isViewOnly) {
      this.form.disable();
    } else {
      this.form.enable();
    }
  }
  clearAll() {
    const patientInfo = this.form.controls['patientInfo'].getRawValue();
    // Reset entire form
    this.form.reset({
      patientInfo: patientInfo
    });
    // Clear medications
    this.medications.clear();
    // Add one fresh medication
    this.medications.push(
      this.medicationFormService.createMedicationGroup()
    );
    this.form.markAsPristine();
    console.log('Form Cleared (Patient Info Preserved)');
  }
  discardChanges() {
    if (!this.lastSavedData) {
      console.log("No saved state to revert to");
      return;
    }
    this.form.reset();
    this.form.patchValue({
      patientInfo: this.lastSavedData.patientInfo,
      prescribingInfo: this.lastSavedData.prescribingInfo
    });
    this.medications.clear();
    this.lastSavedData.medications.forEach((med: any) => {
      const group = this.medicationFormService.createMedicationGroup();
      group.patchValue(med);
      this.medications.push(group);
    });

    this.form.markAsPristine();

    console.log('Changes Discarded');
  }

  submit() {
    // show validation errors
    this.isSubmitAttempted = true;
    this.form.markAllAsTouched();

    if (this.form.invalid) {
      console.log("Form invalid - submission stopped");
      return;
    }
    const data = this.form.getRawValue();
    console.log("Form Data:", data);
    // open validation summary before final submit
    this.showValidationSummary(data);
  }

  showValidationSummary(data: any) {
    const summary = `
    Patient ID: ${data.patientInfo.patientId}
    Physician: ${data.prescribingInfo.physician}
    Therapy Type: ${data.prescribingInfo.therapyType}
    Medications Count: ${data.medications.length}`;
    const confirmSubmit = confirm(
      "Please review your order before submission:\n\n" + summary
    );
    if (confirmSubmit) {
      this.completeSubmission(data);
    }
  }

  completeSubmission(data: any) {
    console.log("Submitting order:", data);
    alert("Medication order submitted successfully!");
    localStorage.removeItem(this.draftKey);
    this.form.reset();
    this.medications.clear();
    this.medications.push(
      this.medicationFormService.createMedicationGroup()
    );
    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.hasUnsavedChanges = false;
    this.lastSavedData = null;
    this.lastSavedTime = null;
    this.isSubmitAttempted = false;


    
  }


  demoGetRawValue() {
    console.log("Form value (disabled fields excluded):");
    console.log(this.form.value);
    console.log("Form getRawValue (includes disabled fields):");
    console.log(this.form.getRawValue());

  }



  existingDrugDatabase = [
    { name: 'Aspirin', id: 101 },
    { name: 'Ibuprofen', id: 102 },
    { name: 'Acetaminophen', id: 103 },
    { name: 'Doxorubicin', id: 104 },
    { name: 'Paclitaxel', id: 105 },
    { name: 'Cisplatin', id: 106 },
    { name: 'Methotrexate', id: 107 },
    { name: 'Vincristine', id: 108 }

  ];
}



