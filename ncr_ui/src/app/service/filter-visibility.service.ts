import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class FilterVisibilityService {
  private filterContractsVisible = new BehaviorSubject<boolean>(true);
  private filterActivityVisible = new BehaviorSubject<boolean>(true);

  filterContractsVisible$ = this.filterContractsVisible.asObservable();
  filterActivityVisible$ = this.filterActivityVisible.asObservable();

  collapseFilters() {
    this.filterContractsVisible.next(false);
    this.filterActivityVisible.next(false);
  }

  expandFilters() {
    this.filterContractsVisible.next(true);
    this.filterActivityVisible.next(true);
  }

  setFilterContractsVisible(value: boolean) {
    this.filterContractsVisible.next(value);
  }

  setFilterActivityVisible(value: boolean) {
    this.filterActivityVisible.next(value);
  }
}
