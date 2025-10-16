export interface OtrTabButton {
  label: string;
  value: string;
  selectedTab?: boolean;
}


export const OTR_TAB_BUTTONS: OtrTabButton[] = [
  { label: 'NCR', value: 'NCR', selectedTab: true },
  { label: 'NCM', value: 'NCM', selectedTab: false },
  { label: 'ECN', value: 'ECN', selectedTab: false },
  { label: 'ECR', value: 'ECR', selectedTab: false },
  { label: 'COQ', value: 'COQ', selectedTab: false },
  { label: 'CCM', value: 'CCM', selectedTab: false },
  { label: 'OTRDR', value: 'OTRDR', selectedTab: false },
  { label: 'FMEA', value: 'FMEA', selectedTab: false },
  { label: 'RCA-NCA-CAPA', value: 'RCA-NCA-CAPA', selectedTab: false },
  { label: 'Product Quality', value: 'Product Quality', selectedTab: false },
  { label: 'Product Safety', value: 'Product Safety', selectedTab: false }
];
