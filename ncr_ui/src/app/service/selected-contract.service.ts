import { Injectable } from '@angular/core';
import { ContractTree } from '../model/contract-tree.model';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SelectedContractService {

  // private selectedContractsSubject = new BehaviorSubject<ContractTree[]>([]);
  // selectedContracts$ = this.selectedContractsSubject.asObservable();

  // setSelectedContracts(contracts: ContractTree[]) {
  //   this.selectedContractsSubject.next(contracts);
  // }

  private selectedContractsSubject = new BehaviorSubject<{
    parents: ContractTree[];
    ids: string[];
  }>({ parents: [], ids: [] });

selectedContracts$ = this.selectedContractsSubject.asObservable();


  setSelectedContracts(data: { parents: ContractTree[]; ids: string[] }): void {
  this.selectedContractsSubject.next(data);
}

}
