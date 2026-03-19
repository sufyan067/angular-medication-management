# 🏥 Medication Order Management System (Angular Reactive Forms)
## 📖 Overview

This project is a **Medication Order Management System** built using Angular Reactive Forms.  
It simulates a real-world healthcare workflow where users can create, manage, validate, and submit medication orders.

The application demonstrates advanced form handling techniques including dynamic forms, validation, state management, and RxJS integration.

---
## 🔗 Live Demo

A live preview of this project is available on StackBlitz:

👉 **[Open Project on StackBlitz](MY_STACKBLITZ_LINK_HERE)**

You can explore and test all features directly in the browser without installing anything.

---

## 🚀 Technologies Used

- Angular 21 (Standalone Components)
- Reactive Forms
- RxJS
- Angular Material UI
- TypeScript

---

## 🧠 Concepts Learned & Strengthened

Through this project, I strengthened my understanding of:

- Reactive Forms architecture
- FormArray for dynamic forms
- Nested FormGroups
- Custom and reusable validators
- Conditional validation logic
- Async validation using `setErrors()`
- RxJS integration with forms
- Form state management (dirty, touched, pristine)
- Auto-save functionality using localStorage
- Handling complex UI validation scenarios
- Managing large form-based applications

---

## 🧩 Reactive Forms Concepts Implemented

### ✔ FormArray
- Dynamic medication list
- Add / Remove medications
- Minimum 1 and maximum 10 constraints

---

### ✔ Nested FormGroups
Medication Order
├── Patient Info
├── Prescribing Info
└── Medications (FormArray)


Medication Order
├── Patient Info
├── Prescribing Info
└── Medications (FormArray)
---

### ✔ Custom Validators

- Dosage range validation
- Duplicate drug validation
- Physician validation (Doctor required for Chemotherapy)
- Async validation (drug existence check)

---

## ⚙ Conditional Validation

### Therapy Type Logic

| Therapy Type | Behavior |
|-------------|---------|
Chemotherapy | Diagnosis required, Physician must be Doctor |
Standard / Supportive | Diagnosis optional |

---

### Route-Based Logic

| Route | Behavior |
|------|---------|
IV | Instructions required |
Other | Instructions optional |

---

## 🔁 patchValue vs setValue

### patchValue (Edit Mode)
- Updates partial data
- Safe for incomplete objects

```ts
form.patchValue({
  patientInfo: { patientId: '123' }
});
ts```

## 💾 Auto-Save Draft Feature

Automatically saves form after 5 seconds

Uses localStorage

Restores form state on reload
