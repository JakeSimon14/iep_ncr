import { ChangeDetectorRef, Component, EventEmitter, Output } from '@angular/core';
import { HeaderComponent } from "../../shared/components/header/header.component";
import { SidebarMenuComponent } from "../../shared/components/sidebar-menu/sidebar-menu.component";
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ContractTree } from '../../model/contract-tree.model';
import { Observable, of } from 'rxjs';
import { ContractTreeService } from '../../service/contract-tree.service';
import { TreeViewModule } from '@progress/kendo-angular-treeview';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';

@Component({
  selector: 'app-ncr-layout',
  standalone: true,
  imports: [CommonModule,HeaderComponent, SidebarMenuComponent,CommonModule,RouterModule,TreeViewModule,ReactiveFormsModule,DropDownsModule],
  templateUrl: './ncr-layout.component.html',
  styleUrl: './ncr-layout.component.scss'
})
export class NcrLayoutComponent {

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

  constructor(
    
    private contractService: ContractTreeService ,
    private fb: FormBuilder,
    private router : Router,
    //private selectionService: BreadcrumbSelectionService,
    private cdr: ChangeDetectorRef
    //private filterSelectionService: FilterSelectionService
  ) 
  {
    this.filterForm = this.fb.group({
      selectAll: [true]
    });

    this.advancedSearchForm = this.fb.group({
    deliveryYear: [null],
    racYear: [null],
    projectStatus: [[]],  // Changed to array
    driver: [[]] 
  });
  }

  ngOnInit(): void {
    //this.searchControl.valueChanges.subscribe(() => this.applyFilters());
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

    //this.searchControl.valueChanges.subscribe(() => this.applyFilters());

     this.searchControl.valueChanges.subscribe(value => {
         this.applySearch(value || '');
     });

this.advancedSearchForm.valueChanges.subscribe(() => {
  this.applySearch(this.searchControl.value || '');
});
    
  }

  ngAfterViewInit(): void {
    //this.fetchFilterItems();
  }


  handleExpandEvent(isChildExpanded: boolean) {
    debugger;
if(!this.isFilterContractsExpanded)
{
    this.showFilterContracts = true; // Hide parent div when child expands
    this.isFilterContractsExpanded=true;
}

  }

  toggleFilterContractsExpand() {
    debugger;
    this.isFilterContractsExpanded = !this.showFilterContracts;
  }

  selectTab(index: number): void {
    this.activeTabIndex = index;
    this.applyTabFilter();
  }

  toggleFavourite(item: ContractTree): void {
    item.isFavourite = !item.isFavourite;
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
  debugger;
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
  this.cdr.detectChanges();
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



emitSelectedContracts(): void {
  const selectedContracts = this.allProjects
    .filter(project => {
      const hasSelectedJob = (node: ContractTree): boolean => {
        if (!node.children || node.children.length === 0) {
          return this.selectedJobs.has(node.id);
        }
        return node.children.some(child => hasSelectedJob(child));
      };
      return hasSelectedJob(project);
    })
    .map(project => project.contractname);
  console.log("Emitted contracts:", selectedContracts);
}

onCheckedKeysChange(checkedKeys: string[]): void {
  this.selectedJobIds = checkedKeys;
  this.selectedJobs = new Set(checkedKeys);

  const allIds = this.collectAllJobIds(this.filteredProjects);
  this.isAllSelected = checkedKeys.length > 0 && checkedKeys.length === allIds.length;

    this.isCurrentProjectsSelected = this.isAllSelected;

  //this.emitSelectedContracts();
  //this.cdr.detectChanges(); // to sync checkbox visual
}



 
  
}