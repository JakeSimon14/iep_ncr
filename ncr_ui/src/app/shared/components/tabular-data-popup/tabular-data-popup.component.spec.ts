import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabularDataPopupComponent } from './tabular-data-popup.component';

describe('TabularDataPopupComponent', () => {
  let component: TabularDataPopupComponent;
  let fixture: ComponentFixture<TabularDataPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TabularDataPopupComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TabularDataPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
