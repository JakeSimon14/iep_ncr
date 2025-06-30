import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { GridModule,ExcelModule, GridComponent } from '@progress/kendo-angular-grid';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { MultiCheckboxFilterComponent } from "../../../pages/dashboard/multi-checkbox-filter/multi-checkbox-filter.component";
import { ExcelExportComponent } from '@progress/kendo-angular-excel-export';
import { FilterVisibilityService } from '../../../service/filter-visibility.service';


@Component({
  selector: 'app-activity-grid',
  standalone: true,
  imports: [
    CommonModule,
    GridModule,
    ExcelModule, 
    ExcelExportComponent,
    InputsModule,
    ReactiveFormsModule,
    MultiCheckboxFilterComponent
],
  templateUrl: './activity-grid.component.html',
    styleUrls: ['./activity-grid.component.scss'],
})
export class ActivityGridComponent {
  @Input() data: any[] = [];
  @Input() originalData: any[] = [];
  @Input() columns: { field: string; title: string; width?: number; filterable?: boolean }[] = [];
  @Input() fileName = 'NCRTabularData.xlsx';
  @Input() searchableFields: string[] = [];
  @Input() fromChartClick: boolean = false;
  @Input() chartFilterLabel: string = ''

  @ViewChild('excelExport', { static: false }) excelExport!: ExcelExportComponent;
  @Output() chartFilterCleared = new EventEmitter<void>();

  searchForm: FormGroup;
  filteredData: any[] = [];
  isExpandedView = false;
  

  constructor(private fb: FormBuilder,private filterVisibilityService: FilterVisibilityService) {
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

  if (this.isExpandedView) {
    //collapse side panels
    this.filterVisibilityService.collapseFilters();
     this.filterVisibilityService.setFilterActivityVisible(false);
  } else {
    //show side panels again
    this.filterVisibilityService.expandFilters();
     this.filterVisibilityService.setFilterActivityVisible(true);
  }
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

  distinctPrimitive(field: string): any[] {
  const uniqueValues = new Set<string>();
  for (const item of this.originalData) {
    if (item[field]) {
      uniqueValues.add(item[field]);
    }
  }
  return Array.from(uniqueValues);
}

onClearChartFilter(): void {
  this.chartFilterCleared.emit();
}

}
