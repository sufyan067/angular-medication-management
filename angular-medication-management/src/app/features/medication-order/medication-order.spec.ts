import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicationOrder } from './medication-order';

describe('MedicationOrder', () => {
  let component: MedicationOrder;
  let fixture: ComponentFixture<MedicationOrder>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MedicationOrder]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MedicationOrder);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
