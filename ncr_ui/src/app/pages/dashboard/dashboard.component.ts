import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TabStripModule  } from '@progress/kendo-angular-layout';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule,TabStripModule ],
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

  activeTabValue = this.tabButtons.find(t => t.selectedTab)?.value ?? this.tabButtons[0].value;

  viewAsOptions = ['Tabular', 'Chart'];
  typeOptions = ['Individual', 'Project', 'Office'];



  //gridData: GridDataItem[] = [];
  //originalGridData: GridDataItem[] = [];


  //private dashboardService = inject(MockDashboardService);
  //private breadcrumbService = inject(BreadcrumbSelectionService);
  //private subBreadcrumb = new Subscription();

  constructor(
    private fb: FormBuilder,
    //private selectionService: BreadcrumbSelectionService,
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

    this.filterActivityForm.valueChanges.subscribe(filters => {
      console.log('Filter values changed:', filters);
    });

    this.searchForm.get('search')!.valueChanges.subscribe((term: string) => {
      this.applySearch(term);
    });

    // this.subBreadcrumb.add(
    //   this.selectionService.getSelection$('breadcrumb').subscribe(selection => {
    //     debugger;
    //     this.selectedBreadcrumb = selection.labels;
    //     this.fetchGridData(selection.jobnumbers);
    //   })
    // );
  }

  toggleExpandView(): void {
    this.isExpandedView = !this.isExpandedView;
  }

  toggleFilterActivityExpandView(): void {
    this.isFilterActivityExpandedView = !this.isFilterActivityExpandedView;
  }

  clearFilters(): void {
    this.filterActivityForm.reset({
      viewAs: '',
      contentType: ''
    });
  }

  fetchGridData(jobnumbers: string[]): void {
    // this.gridMockService.getFilteredData(jobnumbers).subscribe(data => {
    //   debugger;
    //   this.gridData = data;
    //   this.originalGridData = data;
    // });
  }

  applySearch(term: string): void {
    const lowerTerm = term.toLowerCase();

    // this.gridData = this.originalGridData.filter(item =>
    //   Object.values(item).some(value =>
    //     String(value).toLowerCase().includes(lowerTerm)
    //   )
    // );
  }

  ngOnDestroy(): void {
    //this.subBreadcrumb.unsubscribe();
  }

 
}