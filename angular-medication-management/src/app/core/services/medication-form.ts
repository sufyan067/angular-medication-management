import { inject, Injectable } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { dosageRangeValidator, requiredDiagnosisValidator, duplicateDrugValidator, validDrugValidator } from '../validators/medication-validators';
@Injectable({
  providedIn: 'root',
})
export class MedicationForm {
  //private fb = inject (FormBuilder)
  constructor(private fb: FormBuilder) { }


  createDosageGroup(): FormGroup {
    return this.fb.group({
      value: [null, [Validators.required, dosageRangeValidator]],
      unit: [null, [Validators.required]]
    });
  }

  createMedicationGroup(): FormGroup {
    const group = this.fb.group({
      id: [crypto.randomUUID()], // unique id
      drugName: [null, [Validators.required]],
      dosage: this.createDosageGroup(),
      route: [null, [Validators.required]],
      frequency: [null, [Validators.required]],
      instructions: [null]
    });
    const drugControl = group.get('drugName');

    if (drugControl) {

      drugControl.setValidators([
        Validators.required,
        validDrugValidator([
          'Aspirin',
          'Ibuprofen',
          'Acetaminophen',
          'Doxorubicin',
          'Paclitaxel',
          'Cisplatin',
          'Methotrexate',
          'Vincristine'
        ])
      ]);

    }
    const routeControl = group.get('route')!;
    const dosageValueControl = group.get('dosage.value')!;
    const instructionsControl = group.get('instructions')!;

    //  Dynamic validation based on route
    routeControl.valueChanges.subscribe((route) => {

      if (route === 'IV') {
        dosageValueControl.setValidators(
          [Validators.required, Validators.min(0.1)]);
        instructionsControl.setValidators(
          [Validators.required, Validators.minLength(20)]);
      } else {
        dosageValueControl.setValidators(
          [Validators.required, Validators.min(1)]);
        instructionsControl.clearValidators();
      }
      dosageValueControl.updateValueAndValidity();
      instructionsControl.updateValueAndValidity();
    });
    return group;
  }

  createMedicationOrderForm(): FormGroup {

    const form = this.fb.group({
      patientInfo: this.fb.group({
        patientId: [null, [Validators.required]],
        orderDate: [null, [Validators.required]]
      }),

      prescribingInfo: this.fb.group({
        physician: [null, [Validators.required]],
        diagnosis: [null],
        therapyType: [null, [Validators.required]]
      }),

      medications: this.fb.array(
        [this.createMedicationGroup()],
        { validators: [duplicateDrugValidator] }
      )
    });

    // 🔹 Get Controls
    const therapyTypeControl = form.get('prescribingInfo.therapyType')!;
    const diagnosisControl = form.get('prescribingInfo.diagnosis')!;
    const physicianControl = form.get('prescribingInfo.physician')!;

    // 🔹 Physician initially disabled
    physicianControl.disable();

    // 🔹 Diagnosis conditional validator
    diagnosisControl.addValidators(
      requiredDiagnosisValidator(therapyTypeControl)

    );

    // 🔹 Enable/Disable + Validation logic based on therapy type
    therapyTypeControl.valueChanges.subscribe((type) => {

      if (type) {
        physicianControl.enable();
      } else {
        physicianControl.disable();
      }
      const selectedPhysician = physicianControl.value;
      if (type === 'Chemotherapy') {

        diagnosisControl.setValidators([Validators.required]);

        physicianControl.setValidators([
          Validators.required,
          (control) => {
            const value = control.value;
            if (!value) return null;

            return value.startsWith('Dr.')
              ? null
              : { doctorRequired: true };
          }
        ]);

      } else {

        diagnosisControl.clearValidators();

        physicianControl.setValidators([
          Validators.required
        ]);
      }

      diagnosisControl.updateValueAndValidity();
      physicianControl.updateValueAndValidity();
    });

    return form;
  }

  populateFromExisting(form: FormGroup, data: any): void {

    form.patchValue({
      patientInfo: data.patientInfo,
      prescribingInfo: data.prescribingInfo
    });

    const medicationsArray = form.get('medications') as FormArray;
    medicationsArray.clear();

    data.medications.forEach((med: any) => {
      const medGroup = this.createMedicationGroup();
      medGroup.patchValue(med);
      medicationsArray.push(medGroup);
    });
  }

  validateForm(form: FormGroup): boolean {
    form.markAllAsTouched();
    return form.valid;
  }
}


