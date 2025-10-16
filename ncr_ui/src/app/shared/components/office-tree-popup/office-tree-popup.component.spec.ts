import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfficeTreePopupComponent } from './office-tree-popup.component';

describe('OfficeTreePopupComponent', () => {
  let component: OfficeTreePopupComponent;
  let fixture: ComponentFixture<OfficeTreePopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OfficeTreePopupComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OfficeTreePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
