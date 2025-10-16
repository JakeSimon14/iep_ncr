import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DialogModule } from '@progress/kendo-angular-dialog';
import { ExcelExportComponent } from '@progress/kendo-angular-excel-export';
import { GridDataResult, GridModule,ExcelModule } from '@progress/kendo-angular-grid';
import { DovsbuyService } from '../../../service/dovsbuy.service';
import { process } from '@progress/kendo-data-query';
import { InputsModule } from '@progress/kendo-angular-inputs';

@Component({
  selector: 'app-tabular-data-popup',
  standalone: true,
  imports: [CommonModule, GridModule, DialogModule,ReactiveFormsModule,InputsModule,ExcelExportComponent,ExcelModule],
  templateUrl: './tabular-data-popup.component.html',
  styleUrl: './tabular-data-popup.component.scss'
})
export class TabularDataPopupComponent implements OnChanges{

  @Input() popupTitle: string = 'Title';
  @Input() data: any[] = [];
  @Input() columns: { field: string, title: string, width?: number }[] = [];

  @Input() visible: boolean = false;
  @Output() close = new EventEmitter<void>();
  @ViewChild('excelExport', { static: false }) excelExport!: ExcelExportComponent;

   searchForm: FormGroup;
originalGridData : any[] = [];
public gridView !: GridDataResult;
public skip = 0;
public pageSize = 10;
public sort: any[] = [];
fileName = 'DoVsBuyData.xlsx';
   
     constructor(
      private fb: FormBuilder,
       private dovsbuyService: DovsbuyService
     ) {
       this.searchForm = this.fb.group({
      search: ['']
    });
     }

  //  ngOnInit(): void {
  //   debugger;
  //   if (this.popupTitle === "Do vs Buy Deliverable Data Sheet") {
  //     this.LoadDoVsBuyData();
  //   }

  //   this.searchControl.valueChanges.subscribe(term => {
  //     this.data = this.filterData(term || '');
  //   });

ngOnChanges(changes: SimpleChanges): void {
  debugger;
    if (this.popupTitle === "Do vs Buy Deliverable Data Sheet") {
      this.loadGridData();
    }

       this.searchForm.get('search')!.valueChanges.subscribe((term: string) => {

      const filtered = this.filterData(term || '');
  this.gridView = process(filtered, {
    skip: this.skip,
    take: this.pageSize,
    sort: this.sort
  });

    });
}

filterData(term: string): any[] {
  term = term.toLowerCase().trim();
  return this.originalGridData.filter(row =>
    Object.values(row).some(val =>
      String(val).toLowerCase().includes(term)
    )
  );
}
  onClose(): void {
    this.close.emit();
  }

  loadGridData(){
    this.dovsbuyService.getDoVsBuyData().subscribe({
    next: (data) => {
      debugger;
      this.originalGridData = data;
      //this.applyCombinedFilters(); // Initial filter
    },
    error: (err) => {
      console.error('Failed to fetch activity data', err);
    }
  });

   this.gridView = process(this.originalGridData, {
    skip: this.skip,
    take: this.pageSize,
    sort: this.sort
  });
  }

  onPageChange(event: any): void {
  this.skip = event.skip;
  this.loadGridData();
}

onSortChange(sort: any): void {
  this.sort = sort;
  this.loadGridData();
}

}
