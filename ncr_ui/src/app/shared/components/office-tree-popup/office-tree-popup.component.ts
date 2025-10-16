import { Component, EventEmitter, Output } from '@angular/core';
import { OfficeTreeService } from '../../../service/office-tree.service';
import { DialogModule } from '@progress/kendo-angular-dialog';
import { TreeViewModule } from '@progress/kendo-angular-treeview';
import { FormControl,ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { OfficeNode } from '../../../model/office-tree.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-office-tree-popup',
  standalone: true,
  imports: [DialogModule,TreeViewModule,ReactiveFormsModule,CommonModule],
  templateUrl: './office-tree-popup.component.html',
  styleUrl: './office-tree-popup.component.scss'
})
export class OfficeTreePopupComponent {

  activeOfficeTabIndex = 0;
  tabs = ['Favorite Offices', 'All Offices'];
  searchTerm = '';
  checkedKeys: any[] = [];
  fullOfficeTreeData: OfficeNode[] = [];
  officeTreeData: OfficeNode[] = []; // after tab filter
  filteredOfficeTreeData: OfficeNode[] = []; // after search filter
  searchControl = new FormControl('');

  isActiveOfficeSelected = false;
  noDataFound = false;
  isAllSelected = false;
  selectedChips: string[] = [];

   @Output() closePopup = new EventEmitter<void>();

  constructor(private officeTreeService : OfficeTreeService ){}

  ngOnInit(): void {
    this.loadOfficeTreeData();

    this.searchControl.valueChanges.subscribe(term => {
      this.applySearchFilter(term|| '');
    });
  }

  loadOfficeTreeData()
  {
    debugger;
     this.officeTreeService.getOfficesTree().subscribe({
      
      next: (data) => {
      debugger;
      this.fullOfficeTreeData = data;
        this.applyTabFilter();
    },
    error: (err) => {
      console.error('Failed to fetch activity data', err);
    }
    });
  }

//children = (data: any) => data.children;

    hasChildren = (item: object): boolean =>
      !!(item as OfficeNode).children?.length;
  
children = (dataItem: any) => of(dataItem.children);

  selectTab(index: number): void {
    this.activeOfficeTabIndex = index;
    this.checkedKeys = [];
    this.selectedChips = [];
    this.searchControl.setValue(''); 
    this.applyTabFilter();
  }

  applyTabFilter()
  {
    
  switch (this.activeOfficeTabIndex) {
    case 0:
      this.officeTreeData = this.fullOfficeTreeData.filter(
        p => p.isFavourite
      );
      break;
    default:
      this.officeTreeData = [...this.fullOfficeTreeData];
  }

 this.applySearchFilter(this.searchControl.value || '');

  }


applySearchFilter(searchTerm: string): void {
  const value = searchTerm.toLowerCase().trim();

  const filterNodes = (nodes: OfficeNode[]): OfficeNode[] => {
    return nodes
      .map(node => {
        const children = node.children ? filterNodes(node.children) : [];

        const isMatch = node.officename.toLowerCase().includes(value);
        if (isMatch || children.length > 0) {
          return {
            ...node,
            children: children.length > 0 ? children : []
          };
        }
        return null;
      })
      .filter(node => node !== null) as OfficeNode[];
  };

  this.filteredOfficeTreeData = value ? filterNodes(this.officeTreeData) : [...this.officeTreeData];
}


  closeDialog() {
    this.closePopup.emit();
  }

  submitSelection() {
    console.log('Selected Offices:', this.checkedKeys);
  }



onCheckedKeysChange(checkedKeys: string[]): void {
  this.checkedKeys = checkedKeys;

  const flatList = this.makeChildFreeTree(this.officeTreeData);
  this.selectedChips = checkedKeys
    .map(id => {
      const matchOfficeName= flatList.find(item => item.id === id);
      return matchOfficeName ? matchOfficeName.officename : null;
    })
    .filter(name => !!name); // remove nulls
}


makeChildFreeTree(nodes: any[]): any[] {
  let result: any[] = [];

  for (const node of nodes) {
    result.push(node); // add current node
   if (node.children?.length) {
      result.push(...this.makeChildFreeTree(node.children));
   }

  }

  return result;
}

removeChip(index: number): void {
  const chipToRemove = this.selectedChips[index];
  
  const flatList = this.makeChildFreeTree(this.officeTreeData);
  const match = flatList.find(item => item.officename === chipToRemove);

  if (match) {
    // Remove ID from checkedKeys
    this.checkedKeys = this.checkedKeys.filter(key => key !== match.id);

    // Update chips
    this.selectedChips.splice(index, 1);
  }
}



}
