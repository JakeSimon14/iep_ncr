export interface FilterItem {
  id: number;
  contractname: string;
  jobnumber: string;
  myContract?: boolean;  
  isFavourite?: boolean; 
  isSelected: boolean;
  isCollapsed: boolean; 
  assignedToUser?: boolean; 
  children?: FilterItem[]; 
}