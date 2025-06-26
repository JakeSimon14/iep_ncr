import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TabStripModule  } from '@progress/kendo-angular-layout';
import { SelectedContractService } from '../../service/selected-contract.service';
import { ContractTree } from '../../model/contract-tree.model';
import { QualityActivityService } from '../../service/quality-activity.service';
import { GridComponent, GridModule,ExcelModule} from '@progress/kendo-angular-grid';
import { InputsModule } from "@progress/kendo-angular-inputs";
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { MultiCheckboxFilterComponent } from "./multi-checkbox-filter/multi-checkbox-filter.component";

import { filterBy, CompositeFilterDescriptor } from '@progress/kendo-data-query';
import { ActivityGridComponent } from "../../shared/components/activity-grid/activity-grid.component";


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, TabStripModule, GridModule, InputsModule, ReactiveFormsModule, DropDownsModule, MultiCheckboxFilterComponent, ExcelModule, ActivityGridComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  searchForm: FormGroup;
  filterActivityForm: FormGroup;
  percentage =71;
  isFilterActivityExpandedView = false;
  isExpandedView = false;
  hasReassignRequests = true;
  selectedBreadcrumb: string[] = [];
  selectedContracts: ContractTree[] = [];
  selectedIds: string[] = [];
  gridData: any[] = [];   
  originalGridData: any[] = []; 
  filteredBaseData: any[] = []; 

    @ViewChild('grid') grid!: GridComponent;

  tabButtons = [
    { label: 'NCR', value: 'NCR',selectedTab:true },
    { label: 'NCM', value: 'NCM',selectedTab:false },
    { label: 'ECN', value: 'ECN',selectedTab:false },
    { label: 'ECR', value: 'ECR',selectedTab:false },
    { label: 'COQ', value: 'COQ',selectedTab:false },
    { label: 'CCM', value: 'CCM',selectedTab:false },
    { label: 'OTRDR', value: 'OTRDR',selectedTab:false },
    { label: 'FMEA', value: 'FMEA',selectedTab:false },
    { label: 'RCA-NCA-CAPA', value: 'RCA-NCA-CAPA',selectedTab:false },
    { label: 'Product Quality', value: 'Product Quality',selectedTab:false },
    { label: 'Product Safety', value: 'Product Safety',selectedTab:false }
  ];

  gridColumns = [
  { field: 'ncrNumber', title: 'NCR Number', width: 120 },
  { field: 'partId', title: 'Part ID' },
  { field: 'productDescription', title: 'Description' },
  { field: 'partNo', title: 'Part No', width: 100 },
  { field: 'ncrArea', title: 'NCR Area', width: 140 },
  { field: 'imputationCode', title: 'Imputation Code', width: 140 },
  { field: 'type', title: 'Type', width: 100 }
];


  activeTabValue = this.tabButtons.find(t => t.selectedTab)?.value ?? this.tabButtons[0].value;

  //viewAsOptions = ['Tabular', 'Chart'];
  //typeOptions = ['Individual', 'Project', 'Office'];

  filterControls = [
    {
      name: 'viewAs',
      label: 'View As',
      type: 'dropdown',
      placeholder: 'Select View',
      data: ['Tabular', 'Chart']
    },
    {
      name: 'contentType',
      label: 'Type',
      type: 'dropdown',
      placeholder: 'Select Type',
      data: ['Individual', 'Project', 'Office']
    }
  ];

  
  //gridData: GridDataItem[] = [];
  //originalGridData: GridDataItem[] = [];


  //private dashboardService = inject(MockDashboardService);
  //private breadcrumbService = inject(BreadcrumbSelectionService);
  //private subBreadcrumb = new Subscription();

  constructor(
    private fb: FormBuilder,
    private selectedContractService: SelectedContractService,
    private qualityService: QualityActivityService
    //private gridMockService: MockDashboardService
  ) {
    this.searchForm = this.fb.group({
      search: ['']
    });

    this.filterActivityForm = this.fb.group({
      viewAs: [''],
      contentType: ['']
    });
  }

  ngOnInit(): void {
    this.searchForm.valueChanges.subscribe(search => {
      console.log('Search changed:', search.search);
    });

    const group: any = {};
  this.filterControls.forEach(control => {
    if (control.name === 'viewAs') {
      group[control.name] = ['Tabular'];
    } else if (control.name === 'contentType') {
      group[control.name] = ['Individual'];
    } else {
   
    group[control.name] = ['']; // default to empty string
    }
  });

  this.filterActivityForm = this.fb.group(group);

// this.filterActivityForm.valueChanges.subscribe(values => {
//   if (this.selectedIds.length > 0) {
//     this.filterGridByTypeAndContracts();
//   }
// });

//     this.searchForm.get('search')!.valueChanges.subscribe((term: string) => {
//       this.applySearch(term);
//     });

//     this.qualityService.getActivityData().subscribe({
//       next: (data) => {
//         this.originalGridData = data;
//         //this.gridData = [...this.originalGridData];
//       },
//       error: (err) => {
//         console.error('Failed to fetch activity data', err);
//       }
//     });

//  this.selectedContractService.selectedContracts$.subscribe(data => {
//   this.selectedContracts = data.parents;
//   this.selectedIds = data.ids;
  //this.filterGridBySelectedIds();

  //this.filterGridByTypeAndContracts();
  
//});

// Search input
  this.searchForm.get('search')!.valueChanges.subscribe(() => {
    this.applyCombinedFilters();
  });

  // Filter dropdown
  this.filterActivityForm.valueChanges.subscribe(() => {
    this.applyCombinedFilters();
  });

  // Fetch data from service
  this.qualityService.getActivityData().subscribe({
    next: (data) => {
      this.originalGridData = data;
      //this.applyCombinedFilters(); // Initial filter
    },
    error: (err) => {
      console.error('Failed to fetch activity data', err);
    }
  });

  // Contract selection update
  this.selectedContractService.selectedContracts$.subscribe(data => {
    this.selectedContracts = data.parents;
    this.selectedIds = data.ids;
    this.applyCombinedFilters();
  });


  }

  toggleExpandView(): void {
    this.isExpandedView = !this.isExpandedView;

    this.selectedContractService.toggleFilterPanelVisibility.next(!this.isExpandedView);
  }

  toggleFilterActivityExpandView(): void {
    this.isFilterActivityExpandedView = !this.isFilterActivityExpandedView;
  }

  clearFilters(): void {
    this.filterActivityForm.reset({
      viewAs: 'Tabular',
      contentType: 'Individual'
    });

    this.searchForm.reset({ search: '' });

  this.applyCombinedFilters();
  }

  fetchGridData(jobnumbers: string[]): void {
    // this.gridMockService.getFilteredData(jobnumbers).subscribe(data => {
    //   debugger;
    //   this.gridData = data;
    //   this.originalGridData = data;
    // });
  }



applySearch(searchTerm: string): void {
  const value = searchTerm.trim().toLowerCase();


  
   if (!value) {
    this.gridData = [...this.filteredBaseData];
    return;
  }
  
  this.gridData = this.gridData.filter(item =>
    Object.values(item).some(val =>
      String(val).toLowerCase().includes(value)
    )
  );
}

applyCombinedFilters(): void {
  const searchTerm = this.searchForm.get('search')?.value?.trim().toLowerCase() || '';
  const selectedType = this.filterActivityForm.get('contentType')?.value;

  let filtered = [...this.originalGridData];

  // Step 1: Contract filter
  if (this.selectedIds.length > 0) {
    filtered = filtered.filter(item => this.selectedIds.includes(item.contractId));
  }

  // Step 2: Dropdown 'Type' filter
  if (selectedType) {
    filtered = filtered.filter(item => item.type === selectedType);
  }

  // Step 3: Search filter (across all visible fields)
  if (searchTerm) {
    filtered = filtered.filter(item =>
      Object.values(item).some(val =>
        String(val).toLowerCase().includes(searchTerm)
      )
    );
  }

  // Save intermediate filtered data
  this.filteredBaseData = [...filtered];
  this.gridData = [...filtered];
}




  filterGridBySelectedIds(): void {
  if (this.selectedIds.length === 0) {
    this.gridData = [];
  } else {
    this.gridData = this.originalGridData.filter(item => this.selectedIds.includes(item.contractId));
      //this.filteredBaseData=this.gridData; //can be moved if any clear filter issue comes
  }
}


filterGridByTypeAndContracts(): void {
  const selectedType = this.filterActivityForm.get('contentType')?.value;

  this.gridData = this.originalGridData.filter(item =>
    this.selectedIds.includes(item.contractId) &&
    item.type === selectedType
  );
}


  getSelectedContractsInline(): string {
  return this.selectedContracts
    .map(c => `${c.contractname} (${c.jobnumber})`)
    .join(', ');
}

getSelectedContractsTooltip(): string {
  return this.getSelectedContractsInline();
}

distinctPrimitive(field: string): any[] {
  const uniqueValues = new Set<string>();
  for (const item of this.originalGridData) {
    if (item[field]) {
      uniqueValues.add(item[field]);
    }
  }
  return Array.from(uniqueValues);
}

exportToExcel(): void {
    this.grid.saveAsExcel();
  }
  
  ngOnDestroy(): void {
    //this.subBreadcrumb.unsubscribe();
  }

 
}