import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { GridModule, ExcelModule, GridComponent } from '@progress/kendo-angular-grid';
import { InputsModule } from '@progress/kendo-angular-inputs';

@Component({
  selector: 'app-activity-grid',
  standalone: true,
  imports: [
    CommonModule,
    GridModule,
    ExcelModule,
    InputsModule,
    ReactiveFormsModule
  ],
  templateUrl: './activity-grid.component.html'
})
export class ActivityGridComponent {
  @Input() data: any[] = [];
  @Input() columns: { field: string; title: string; width?: number; filterable?: boolean }[] = [];
  @Input() fileName = 'Export.xlsx';
  @Input() searchableFields: string[] = [];

  searchForm: FormGroup;
  filteredData: any[] = [];
  isExpandedView = false;

  constructor(private fb: FormBuilder) {
    this.searchForm = this.fb.group({
      search: ['']
    });
  }

  ngOnInit(): void {
    this.filteredData = [...this.data];
    this.searchForm.get('search')!.valueChanges.subscribe((term: string) => {
      this.applySearch(term);
    });
  }

  ngOnChanges(): void {
    this.filteredData = [...this.data];
  }

  toggleExpandView(): void {
    this.isExpandedView = !this.isExpandedView;
  }

  exportToExcel(grid: GridComponent): void {
    if (grid) {
      grid.saveAsExcel();
    }
  }

  applySearch(term: string): void {
    const value = term.trim().toLowerCase();
    if (!value) {
      this.filteredData = [...this.data];
      return;
    }

    this.filteredData = this.data.filter(item =>
      this.searchableFields.some(field =>
        item[field]?.toString().toLowerCase().includes(value)
      )
    );
  }
}
