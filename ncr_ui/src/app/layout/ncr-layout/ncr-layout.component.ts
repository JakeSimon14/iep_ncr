import {  ChangeDetectorRef, Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { HeaderComponent } from "../../shared/components/header/header.component";
import { SidebarMenuComponent } from "../../shared/components/sidebar-menu/sidebar-menu.component";
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ContractTree } from '../../model/contract-tree.model';
import { Observable, of } from 'rxjs';
import { ContractTreeService } from '../../service/contract-tree.service';
import { TreeViewModule } from '@progress/kendo-angular-treeview';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { SelectedContractService } from '../../service/selected-contract.service';
import { PopupModule } from '@progress/kendo-angular-popup';
import { TooltipModule } from '@progress/kendo-angular-tooltip';
import { FilterVisibilityService } from '../../service/filter-visibility.service';
import { ExcelExportComponent } from '@progress/kendo-angular-excel-export';
import { ExcelModule } from '@progress/kendo-angular-grid';

@Component({
  selector: 'app-ncr-layout',
  standalone: true,
  imports: [CommonModule,FormsModule,HeaderComponent, SidebarMenuComponent,CommonModule,RouterModule,TreeViewModule,ReactiveFormsModule,DropDownsModule,
    PopupModule,
    TooltipModule,
    ExcelExportComponent,
    ExcelModule
  ],
  templateUrl: './ncr-layout.component.html',
  styleUrl: './ncr-layout.component.scss'
})
export class NcrLayoutComponent {

   @ViewChild('excelExport', { static: false }) excelExport!: ExcelExportComponent;
   
  showFilterContracts = true;

  isFilterContractsExpanded = true;
  activeTabIndex = 0;
  tabs = ['My Contracts', 'All Contracts', 'Favourites'];
   deliveryYears = ['2023', '2024', '2025'];
  racYears = ['2023', '2024', '2025'];
  projectStatuses = ['Active', 'Completed', 'On Hold'];
  drivers = ['Driver A', 'Driver B', 'Driver C'];
  isCurrentProjectsSelected = false;
  showAdvancedSearch = false;
  noDataFound = false;
  isAllSelected = false;
 
  searchControl = new FormControl('');
  filterForm: FormGroup;
  advancedSearchForm: FormGroup;

  allProjects: ContractTree[] = [];
  filteredProjects: ContractTree[] = [];
  originalProjects: ContractTree[] = [];

  checkedKeys: string[] = [];
  public expandedKeys: any[] = ["0", "1"];
selectedJobIds: string[] = [];
selectedJobs = new Set<string>();

 columns = [
  { field: 'contractname', title: 'Contract Name', width: 120 },
  { field: 'jobnumber', title: 'Job Number' },
  { field: 'deliveryYear', title: 'Delivery Year' },
  { field: 'racYear', title: 'RAC Year', width: 100 },
  { field: 'projectStatus', title: 'Status', width: 140 },
  { field: 'driver', title: 'Driver', width: 100 }
];

  constructor(
    
    private contractService: ContractTreeService ,
    private fb: FormBuilder,
    private router : Router,
    //private selectionService: BreadcrumbSelectionService,
    private selectedContractService: SelectedContractService,
    private filterVisibilityService: FilterVisibilityService,
    private cdr: ChangeDetectorRef
  ) 
  {
    this.filterForm = this.fb.group({
      selectAll: [true]
    });

    this.advancedSearchForm = this.fb.group({
    deliveryYear: [null],
    racYear: [null],
    projectStatus: [[]],  
    driver: [[]] 
  });
  }

  ngOnInit(): void {
    
    this.contractService.getContractTree().subscribe({
      next: (data) => {
        this.allProjects = data;
        this.filteredProjects = [...this.allProjects];
        this.originalProjects = [...this.filteredProjects];
        this.applyTabFilter();
      },
      error: (err) => {
        console.error('Failed to fetch contract tree', err);
      }
    });

    this.selectedContractService.toggleFilterPanelVisibility.subscribe((visible: boolean) => {
    this.showFilterContracts = visible;
    this.isFilterContractsExpanded = visible;
  });
    //this.searchControl.valueChanges.subscribe(() => this.applyFilters());

     this.searchControl.valueChanges.subscribe(value => {
      this.clearSelections();
         this.applySearch(value || '');
     });

this.advancedSearchForm.valueChanges.subscribe(() => {
  this.clearSelections();
  this.applySearch(this.searchControl.value || '');
});
    
 //const saved = localStorage.getItem('ContractTreeFilters');
  //this.savedContractTreeFilters = saved ? JSON.parse(saved) : [];
const saved = JSON.parse(localStorage.getItem('ContractTreeFilters') || '[]');
this.savedContractTreeFilters = saved.map((f: any) => f.name);

this.filterVisibilityService.filterContractsVisible$.subscribe(visible => {
  this.isFilterContractsExpanded = visible;
  this.showFilterContracts = visible;
});

  }

  ngAfterViewInit(): void {
    //this.fetchFilterItems();
  }

commaTagMapper = (tags: any[]) => {
  return tags.length
    ? [{ text: tags.join(', '), data: tags }]
    : [];
};


  handleExpandEvent(isChildExpanded: boolean) {
   
if(!this.isFilterContractsExpanded)
{
    this.showFilterContracts = true; // Hide parent div when child expands
    this.isFilterContractsExpanded=true;
}

  }

  toggleFilterContractsExpand() {
   
    this.isFilterContractsExpanded = !this.showFilterContracts;
  }

  selectTab(index: number): void {
    this.activeTabIndex = index;

 this.clearSelections();
//this.cdr.detectChanges();
  
    this.applyTabFilter();
  }

  toggleFavourite(item: ContractTree): void {
    //item.isFavourite = !item.isFavourite;

 const updateInTree = (nodes: ContractTree[]): boolean => {
    for (const node of nodes) {
      if (node.id === item.id) {
        node.isFavourite = !node.isFavourite;
        return true;
      }

      if (node.children?.length && updateInTree(node.children)) {
        return true;
      }
    }
    return false;
  };

  // ✅ Update the main source of truth
  updateInTree(this.allProjects);
   updateInTree(this.filteredProjects);

  }

  onMenuChange(route: string): void {
    this.router.navigate([route]);
  }

 toggleAdvancedSearch(): void {
  this.showAdvancedSearch = !this.showAdvancedSearch;
}

clearAdvancedFilters(): void {
    this.advancedSearchForm.reset();
  }

applyTabFilter(): void {

  this.advancedSearchForm.reset(); 
  //this.clearSelections();
 
  switch (this.activeTabIndex) {
    case 0:
      this.filteredProjects = this.allProjects.filter(
        p => p.assignedToUser
      );
      break;
    case 2:
      this.filteredProjects = this.allProjects.filter(
        p => p.isFavourite
      );
      break;
    default:
      this.filteredProjects = [...this.allProjects];
  }

  this.originalProjects = [...this.filteredProjects];
  this.applySearch(this.searchControl.value || '');
}

  clearSelections(): void {

    
     this.checkedKeys = [];
  this.selectedJobIds = [];
  this.selectedJobs.clear();
  this.isAllSelected = false;
  this.isCurrentProjectsSelected = false;
    this.emitSelectedContracts();
}

applySearch(searchTerm: string): void {
  const value = searchTerm.toLowerCase().trim();

  //extract filters
  const {
    deliveryYear,
    racYear,
    projectStatus,
    driver
  } = this.advancedSearchForm?.value || {};

  const filterContractTree = (contracts: ContractTree[]): ContractTree[] => {
    return contracts.reduce((acc: ContractTree[], contract) => {
      let filteredChildren: ContractTree[] = [];

      if (contract.children && contract.children.length > 0) {
        filteredChildren = filterContractTree(contract.children);
      }

      //search matchh
      const matchesSearch =
        !value ||
        contract.contractname?.toLowerCase().includes(value) ||
        contract.jobnumber?.toLowerCase().includes(value);

      //filter matches checking
      const matchesDeliveryYear = !deliveryYear || contract.deliveryYear === deliveryYear;
      const matchesRacYear = !racYear || contract.racYear === racYear;
      const matchesStatus = !projectStatus?.length || projectStatus.includes(contract.projectStatus);
      const matchesDriver = !driver?.length || driver.includes(contract.driver);

      //Include logic is below
      const matchesAllFilters =
        matchesSearch &&
        matchesDeliveryYear &&
        matchesRacYear &&
        matchesStatus &&
        matchesDriver;

      const includeNode = matchesAllFilters || filteredChildren.length > 0;

      if (includeNode) {
        acc.push({
          ...contract,
          children: filteredChildren
        });
      }

      return acc;
    }, []);
  };

  this.filteredProjects = filterContractTree(this.originalProjects);
  this.noDataFound = this.filteredProjects.length === 0;
}







  fetchChildren = (item: object): Observable<object[]> =>
    of((item as ContractTree).children || []);

  hasChildren = (item: object): boolean =>
    !!(item as ContractTree).children?.length;

  hasParent(item: ContractTree): boolean {
    return this.originalProjects.some(parent => parent.children?.includes(item));
  }

  children = (dataItem: any) => of(dataItem.children);


toggleSelectAll(event: Event): void {
  const checked = (event.target as HTMLInputElement).checked;

  if (checked) {
    const allIds = this.collectAllJobIds(this.filteredProjects);
    this.selectedJobIds = allIds;
    this.selectedJobs = new Set(allIds);
    this.isAllSelected = true;
  } else {
    this.selectedJobIds = [];
    this.selectedJobs.clear();
    this.isAllSelected = false;
  }

  this.emitSelectedContracts();
  //this.cdr.detectChanges();
}



private collectAllJobIds(projects: ContractTree[]): string[] {
  const ids: string[] = [];

  const recurse = (items: ContractTree[]) => {
    for (const item of items) {
      ids.push(item.id.toString());
      if (item.children?.length) {
        recurse(item.children);
      }
    }
  };

  recurse(projects);
  return ids;
}



// emitSelectedContracts(): void {
//   const selectedContracts: ContractTree[] = [];

//   const collectSelected = (nodes: ContractTree[]) => {
//     for (const node of nodes) {
//       if (this.selectedJobs.has(node.id)) {
//         selectedContracts.push(node);
//       }
//       if (node.children?.length) {
//         collectSelected(node.children);
//       }
//     }
//   };

//   collectSelected(this.allProjects);

//   this.selectedContractService.setSelectedContracts(selectedContracts);
// }

emitSelectedContracts(): void {

  const selectedParents = this.getSelectedParentContracts();
  const selectedIds = this.getAllSelectedIds();

  this.selectedContractService.setSelectedContracts({
    parents: selectedParents,
    ids: selectedIds
  });
}


getAllSelectedIds(): string[] {
  return Array.from(this.selectedJobs);
}

getSelectedParentContracts(): ContractTree[] {
  const selectedParents: ContractTree[] = [];

  const isNodeSelected = (node: ContractTree): boolean => {
    if (this.selectedJobs.has(node.id)) return true;
    return node.children?.some(child => isNodeSelected(child)) ?? false;
  };

  for (const parent of this.allProjects) {
    if (isNodeSelected(parent)) {
      selectedParents.push(parent);
    }
  }

  return selectedParents;
}



onCheckedKeysChange(checkedKeys: string[]): void {
  this.selectedJobIds = checkedKeys;
  this.selectedJobs = new Set(checkedKeys);

  // Only consider visible projects for "select all" logic
  const visibleIds = this.collectAllJobIds(this.filteredProjects);
  this.isAllSelected = checkedKeys.length > 0 && checkedKeys.length === visibleIds.length;

  console.log(this.isAllSelected);
  console.log("visible : "+ visibleIds);

  // Keep Current Projects synced
  this.isCurrentProjectsSelected = this.isAllSelected;

  this.emitSelectedContracts();
}



//------------------------
//clear filter

showSettingsPopup = false;
submenuOpen = false;
hovering = false;
lastUploadOpen = false;

lastUploadedItems = [
  { name: 'ITO - Train configuration & Opportunity Driver-Driven', date: '01-Jan-2025' },
  { name: 'ITO Information', date: '01-Jan-2025' },
  { name: 'Serial Number', date: '01-Jan-2025' },
  { name: 'Industrial segment file', date: '01-Jan-2025' },
  { name: 'P6-project creation file', date: '01-Jan-2025' },
  { name: 'Unifier project creation file', date: '01-Jan-2025' }
];


savedContractTreeFilters: string[] = [];

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

  // const newFilter = `Saved Filter ${this.savedContractTreeFilters.length + 1}`;
  // this.savedContractTreeFilters.push(newFilter);
  // localStorage.setItem('ContractTreeFilters', JSON.stringify(this.savedContractTreeFilters));

  const savedFilter = {
    name: `Saved Filter ${this.savedContractTreeFilters.length + 1}`,
    //search: this.searchControl.value,
    form: this.advancedSearchForm.value,
    //selectedJobIds: [...this.selectedJobIds]
  };

  const existingFilters = JSON.parse(localStorage.getItem('ContractTreeFilters') || '[]');
  existingFilters.push(savedFilter);
  localStorage.setItem('ContractTreeFilters', JSON.stringify(existingFilters));

  this.savedContractTreeFilters.push(savedFilter.name);
}

onLoadFilter(name: string): void {
  console.log('Load Filter:', name);
  this.showSettingsPopup = false;

   const savedFilters = JSON.parse(localStorage.getItem('ContractTreeFilters') || '[]');
  const selected = savedFilters.find((f: any) => f.name === name);


  if (!selected) return;

  //this.searchControl.setValue(selected.search || '');
  // this.advancedSearchForm.patchValue(selected.form || {});
setTimeout(() => {
  this.advancedSearchForm.patchValue({
      deliveryYear: selected.form?.deliveryYear || null,
      racYear: selected.form?.racYear || null,
      projectStatus: selected.form?.projectStatus || [],
      driver: selected.form?.driver || []
    });
  });
  //this.selectedJobIds = selected.selectedJobIds || [];
  //this.selectedJobs = new Set(this.selectedJobIds);

  this.applyTabFilter(); 
}

onInstructions(): void {
  console.log('Instructions clicked');
  this.showSettingsPopup = false;
}




//---------------------------------
 
  
}