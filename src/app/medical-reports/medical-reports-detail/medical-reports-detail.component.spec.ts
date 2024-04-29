import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalReportsDetailComponent } from './medical-reports-detail.component';

describe('MedicalReportsDetailComponent', () => {
  let component: MedicalReportsDetailComponent;
  let fixture: ComponentFixture<MedicalReportsDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MedicalReportsDetailComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MedicalReportsDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
