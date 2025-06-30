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
import { ActivityGridComponent } from "../../shared/components/activity-grid/activity-grid.component";
import { ActivityChartComponent } from "../../shared/components/activity-chart/activity-chart.component";
import { PopupModule } from '@progress/kendo-angular-popup';
import { TooltipModule } from '@progress/kendo-angular-tooltip';
import { FilterVisibilityService } from '../../service/filter-visibility.service';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, TabStripModule, GridModule, InputsModule, ReactiveFormsModule, DropDownsModule,PopupModule, ExcelModule, ActivityGridComponent, ActivityChartComponent,TooltipModule],
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

  chartData: any[] = [];
  chartFilteredGridData: any[] = [];
  chartFilterLabel: string = '';

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
    private qualityService: QualityActivityService,
    private filterVisibilityService: FilterVisibilityService
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

  const saved = localStorage.getItem('GridFilters');
  this.savedGridFilters = saved ? JSON.parse(saved) : [];

 this.filterVisibilityService.filterActivityVisible$.subscribe(visible => {
  debugger;
      if (visible) {
      // Reset to collapsed even if visibility is true
      this.isFilterActivityExpandedView = false;
    }
    else
    this.isFilterActivityExpandedView = true;
    });
  }

  toggleExpandView(): void {
    this.isExpandedView = !this.isExpandedView;

    this.selectedContractService.toggleFilterPanelVisibility.next(!this.isExpandedView);
  }

 toggleFilterActivityExpandView(): void {
  //this.isFilterActivityExpandedView = !this.isFilterActivityExpandedView;
debugger;
  this.filterVisibilityService.filterActivityVisible$.subscribe((visible) => {
    debugger;
    if (visible) {
   
      this.isFilterActivityExpandedView = false;
    }
    else
    this.isFilterActivityExpandedView = true;
  });

  this.filterVisibilityService.setFilterActivityVisible(this.isFilterActivityExpandedView);
}


  clearFilters(): void {

    this.chartFilteredGridData =[];
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

  if (!this.selectedIds || this.selectedIds.length === 0) {
    this.gridData = [];
    this.chartData = [];
    this.filteredBaseData = [];
    return;
  }

  let filtered = [...this.originalGridData];

  // Contract filter
  filtered = filtered.filter(item => this.selectedIds.includes(item.contractId));

  // Dropdown type filter
  if (selectedType) {
    filtered = filtered.filter(item => item.type === selectedType);
  }

  // Search filter 
  if (searchTerm) {
    filtered = filtered.filter(item =>
      Object.values(item).some(val =>
        String(val).toLowerCase().includes(searchTerm)
      )
    );
  }

  // Save filtered data
  this.filteredBaseData = [...filtered];
  this.gridData = [...filtered];
  this.chartData = [...filtered];
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

 openKaizen(): void {
  window.open('https://www.google.com/', '_blank');
}


//------------------------
//clear filter

showSettingsPopup = false;
submenuOpen = false;
hovering = false;

savedGridFilters: string[] = [];

tooltipText: string = `
How to Use Filters:\n
Select filters to narrow down data. Click Save Filter to save.
Load Filter to apply saved settings.`;


toggleSettingsPopup(): void {
  this.showSettingsPopup = !this.showSettingsPopup;
}

onSaveFilter(): void {
  console.log('Save Filter clicked');
  this.showSettingsPopup = false;

  //const newFilter = `Saved Filter ${this.savedGridFilters.length + 1}`;
  //this.savedGridFilters.push(newFilter);

  const newFilterName = `Saved Filter ${this.savedGridFilters.length + 1}`;
  this.savedGridFilters.push(newFilterName);

  // Prepare complete filter object
  const savedFilterData = {
    name: newFilterName,
    formValues: this.filterActivityForm.value,
    //searchTerm: this.searchForm.get('search')?.value || '',
    //contractIds: this.selectedIds
  };

  // Get existing saved filter data
  const existingFilter = JSON.parse(localStorage.getItem('GridFilterData') || '[]');
  existingFilter.push(savedFilterData);
  localStorage.setItem('GridFiltersData', JSON.stringify(existingFilter));

  localStorage.setItem('GridFilters', JSON.stringify(this.savedGridFilters));
}

onLoadFilter(name: string): void {
  console.log('Load Filter:', name);

  const savedFilters = JSON.parse(localStorage.getItem('GridFiltersData') || '[]');
  const match = savedFilters.find((f: any) => f.name === name);

  if (match) {
    this.filterActivityForm.patchValue(match.formValues || {});
    //this.searchForm.patchValue({ search: match.searchTerm || '' });

    // if (Array.isArray(match.contractIds)) {
    //   this.selectedIds = match.contractIds;
    //   this.applyCombinedFilters();
    // }

    this.applyCombinedFilters();
  }

  this.showSettingsPopup = false;
}

onInstructions(): void {
  console.log('Instructions clicked');
  this.showSettingsPopup = false;
}




//---------------------------------

//----------Chart items

onChartBarClick(filtered: any[]): void {
  console.log('Chart bar clicked - dashboard handler triggered:', filtered);

  this.chartFilteredGridData = filtered;
  this.filterActivityForm.get('viewAs')?.setValue('Tabular');

  if (filtered.length > 0) {
    const first = new Date(filtered[0].createdDate);
    const month = first.toLocaleString('en-US', { month: 'long' });
    const year = first.getFullYear();
    this.chartFilterLabel = `${month} ${year}`;
  } else {
    this.chartFilterLabel = '';
  }
}

clearChartFilter(): void {
  this.chartFilteredGridData = [];
  this.chartFilterLabel = '';
  this.filterActivityForm.get('viewAs')?.setValue('Chart');
}

//-----------------------------

}