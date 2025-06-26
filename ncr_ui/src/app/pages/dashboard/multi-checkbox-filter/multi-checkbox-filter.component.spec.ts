import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiCheckboxFilterComponent } from './multi-checkbox-filter.component';

describe('MultiCheckboxFilterComponent', () => {
  let component: MultiCheckboxFilterComponent;
  let fixture: ComponentFixture<MultiCheckboxFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MultiCheckboxFilterComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MultiCheckboxFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
