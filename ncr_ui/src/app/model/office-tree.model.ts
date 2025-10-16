export interface OfficeNode {
  id: string;
  officename: string;
  isFavourite?: boolean;
  children: OfficeNode[];  // always define as array
}