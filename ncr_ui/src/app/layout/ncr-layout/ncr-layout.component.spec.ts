import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NcrLayoutComponent } from './ncr-layout.component';

describe('NcrLayoutComponent', () => {
  let component: NcrLayoutComponent;
  let fixture: ComponentFixture<NcrLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NcrLayoutComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NcrLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
