export interface ContractTree {
  id: string;
  contractname: string;
  jobnumber: string;
  myContract?: boolean;  
  isFavourite?: boolean; 
  isSelected: boolean;
  isCollapsed: boolean; 
  assignedToUser?: boolean; 
  children: ContractTree[]; 
}