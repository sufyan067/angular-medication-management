import { AbstractControl, ValidationErrors, FormArray } from '@angular/forms';

/* ======================================
   1. Dosage Range Validator
====================================== */

export function dosageRangeValidator(control: AbstractControl): ValidationErrors | null {
    const value = Number(control.value);
    if (isNaN(value)) {
        return { dosageRange: { min: 0.1, max: 5000, actual: control.value } };
    }
    if (value < 0.1 || value > 5000) {
        return {
            dosageRange: {
                min: 0.1,
                max: 5000,
                actual: value
            }
        };
    }
    return null;
}

/* ======================================
   2. Required Diagnosis Validator
====================================== */

export function requiredDiagnosisValidator(therapyTypeControl: AbstractControl) {
    return (control: AbstractControl): ValidationErrors | null => {
        if (therapyTypeControl.value === 'Chemotherapy' && !control.value) {
            return { requiredDiagnosis: true };
        }
        return null;
    };
}
// Explanation
// Yeh higher-order function hai.
// Pehle hum therapyTypeControl pass karte hain.
// Phir actual validator diagnosis pe apply hota hai.


/* ======================================
   3. Duplicate Drug Validator
====================================== */

export function duplicateDrugValidator(control: AbstractControl): ValidationErrors | null {
    const formArray = control as FormArray;
    if (!formArray?.controls) return null;
    const names = formArray.controls.map(group =>
        group.get('drugName')?.value?.toLowerCase()?.trim()
    ).filter(name => name);
    const duplicate = names.find(
        (name, index) => names.indexOf(name) !== index);
    return duplicate ? { duplicateDrug: { drugName: duplicate } } : null;
}
// Explanation
// Sare drugName collect karo
// Normalize karo (lowercase + trim)
// Check karo duplicate exist karta hai?
// Error return karo


export function validDrugValidator(availableDrugs: string[]) {
  return (control: AbstractControl): ValidationErrors | null => {

    const value = control.value;

    if (!value) return null;

    const isValid = availableDrugs.includes(value);

    return isValid ? null : { invalidDrug: true };
  };
}