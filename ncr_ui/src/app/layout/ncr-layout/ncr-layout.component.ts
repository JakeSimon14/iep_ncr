import { Component, EventEmitter, Output } from '@angular/core';
import { HeaderComponent } from "../../shared/components/header/header.component";
import { SidebarMenuComponent } from "../../shared/components/sidebar-menu/sidebar-menu.component";
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FilterItem } from '../../model/contract-tree.model';
import { Observable, of } from 'rxjs';
import { ContractTreeService } from '../../service/contract-tree.service';
import { TreeViewModule } from '@progress/kendo-angular-treeview';

@Component({
  selector: 'app-ncr-layout',
  standalone: true,
  imports: [CommonModule,HeaderComponent, SidebarMenuComponent,CommonModule,RouterModule,TreeViewModule,ReactiveFormsModule],
  templateUrl: './ncr-layout.component.html',
  styleUrl: './ncr-layout.component.scss'
})
export class NcrLayoutComponent {

  showFilterContracts = true;

  isFilterContractsExpanded = true;
  activeTabIndex = 0;
  tabs = ['My Contracts', 'All Contracts', 'Favourites'];
  isCurrentProjectsSelected = false;

 
  searchControl = new FormControl('');
  filterForm: FormGroup;

  filterItems: FilterItem[] = [];
  originalItems: FilterItem[] = [];
  checkedKeys: string[] = [];
  public expandedKeys: any[] = ["0", "1"];


  constructor(
    
    private contractService: ContractTreeService ,
    private fb: FormBuilder,
    private router : Router
    //private selectionService: BreadcrumbSelectionService,
    //private cdr: ChangeDetectorRef,
    //private filterSelectionService: FilterSelectionService
  ) {
    this.filterForm = this.fb.group({
      selectAll: [true]
    });
  }

  ngOnInit(): void {
    //this.searchControl.valueChanges.subscribe(() => this.applyFilters());
    this.contractService.getContractTree().subscribe({
      next: (data) => {
        this.filterItems = data;
      },
      error: (err) => {
        console.error('Failed to fetch contract tree', err);
      }
    });
  }

  ngAfterViewInit(): void {
    this.fetchFilterItems();
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
    this.applyFilters();
  }

  toggleFavourite(item: FilterItem): void {
    item.isFavourite = !item.isFavourite;
  }

  onMenuChange(route: string): void {
    this.router.navigate([route]);
  }

 

  selectAll(checked: boolean): void {
    const allKeys = this.getAllKeys(this.filterItems);
    this.checkedKeys = checked ? allKeys : [];
    this.filterForm.get('selectAll')?.setValue(checked, { emitEvent: false });
  }

  isAllSelected(): boolean {
    const allKeys = this.getAllKeys(this.filterItems);
    return allKeys.length > 0 && this.checkedKeys.length === allKeys.length;
  }

  onCheckedKeysChange(checked: string[]): void {
    this.checkedKeys = checked;
    const allKeys = this.getAllKeys(this.filterItems);
    const isAll = allKeys.length > 0 && checked.length === allKeys.length;
    this.filterForm.get('selectAll')?.setValue(isAll, { emitEvent: false });
  }

  onCheckedChange(checkedKeys: string[]): void {
    this.checkedKeys = checkedKeys;

    const selectedLabels = this.getSelectedLabels(this.filterItems, new Set(checkedKeys));
    //this.selectionService.updateSelection('breadcrumb', selectedLabels, checkedKeys);
    //this.filterSelectionService.setSelectedJobNumbers(checkedKeys);
  }

  onCurrentProjectsClick(): void {
    const assignedKeys = this.collectAssignedKeys(this.filterItems);
    const assignedKeySet = new Set(assignedKeys);

    if (this.isCurrentProjectsSelected) {
      // uncheck
      this.checkedKeys = this.checkedKeys.filter(key => !assignedKeySet.has(key));
      this.isCurrentProjectsSelected = false;
    } else {
      // check
      this.checkedKeys = Array.from(new Set([...this.checkedKeys, ...assignedKeys]));
      this.isCurrentProjectsSelected = true;
    }

    const updatedLabels = this.getSelectedLabels(this.filterItems, new Set(this.checkedKeys));
    //this.selectionService.updateSelection('breadcrumb', updatedLabels, this.checkedKeys);
  }

  applyDefaultSelection(): void {
    const assignedKeys = this.collectAssignedKeys(this.filterItems);

    if (assignedKeys.length) {
      this.checkedKeys = [...assignedKeys];
      this.onCheckedChange(this.checkedKeys);
      //this.cdr.detectChanges();
    }
  }

 

  fetchFilterItems(): void {
    // this.contractService.getContracts().subscribe(data => {
    //   this.originalItems = data;
    //   this.applyFilters();

    //   setTimeout(() => this.applyDefaultSelection(), 0);
    // });
  }

  applyFilters(): void {
    const search = this.searchControl.value?.toLowerCase() || '';

    const matchesTabCondition = (item: FilterItem): boolean => {
      switch (this.activeTabIndex) {
        case 0: return !!item.assignedToUser;
        case 1: return true;
        case 2: return !!item.isFavourite;
        default: return true;
      }
    };

    const matchesSearch = (item: FilterItem): boolean => {
      return item.contractname.toLowerCase().includes(search) ||
             item.jobnumber.toLowerCase().includes(search);
    };

    const filterRecursive = (items: FilterItem[]): FilterItem[] => {
      return items
        .map(item => {
          const children = filterRecursive(item.children || []);
          const include = matchesTabCondition(item);
          const match = include && matchesSearch(item);

          if (match || children.length || item.assignedToUser) {
            return { ...item, children };
          }
          return null;
        })
        .filter(item => item !== null) as FilterItem[];
    };

    this.filterItems = filterRecursive(this.originalItems);

    const allKeys = this.getAllKeys(this.filterItems);
    this.checkedKeys = this.checkedKeys.filter(k => allKeys.includes(k));
    this.filterForm.get('selectAll')?.setValue(this.isAllSelected(), { emitEvent: false });
  }



  fetchChildren = (item: object): Observable<object[]> =>
    of((item as FilterItem).children || []);

  hasChildren = (item: object): boolean =>
    !!(item as FilterItem).children?.length;

  hasParent(item: FilterItem): boolean {
    return this.originalItems.some(parent => parent.children?.includes(item));
  }



  private getAllKeys(items: FilterItem[]): string[] {
    const keys: string[] = [];

    const collect = (list: FilterItem[]) => {
      for (const item of list) {
        if (item.jobnumber) keys.push(item.jobnumber);
        if (item.children?.length) collect(item.children);
      }
    };

    collect(items);
    return keys;
  }

  private getSelectedLabels(items: FilterItem[], checkedSet: Set<string>): string[] {
    const labels: string[] = [];

    const traverse = (nodes: FilterItem[]) => {
      for (const node of nodes) {
        if (checkedSet.has(node.jobnumber)) {
          labels.push(node.contractname);
        }
        if (node.children) {
          traverse(node.children);
        }
      }
    };

    traverse(items);
    return labels;
  }

  private collectAssignedKeys(items: FilterItem[]): string[] {
    const result: string[] = [];

    const traverse = (nodes: FilterItem[]) => {
      for (const node of nodes) {
        if (node.assignedToUser) {
          result.push(node.jobnumber);
        }
        if (node.children?.length) {
          traverse(node.children);
        }
      }
    };

    traverse(items);
    return result;
  }
}
