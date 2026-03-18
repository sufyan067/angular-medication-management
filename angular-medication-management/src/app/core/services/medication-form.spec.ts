import { TestBed } from '@angular/core/testing';

import { MedicationForm } from './medication-form';

describe('MedicationForm', () => {
  let service: MedicationForm;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MedicationForm);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
