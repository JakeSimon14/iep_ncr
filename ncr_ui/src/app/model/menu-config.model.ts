export interface OtrMenuItem {
  id: string;
  label: string;
  icon: string;
  route: string;
}

export const ConstOtrDashboardMenu: OtrMenuItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: 'home', route: '/dashboard' },
  { id: 'folder_managed', label: 'Folder Managed', icon: 'folder_managed', route: '/folder_managed' },
  { id: 'folder', label: 'Folder', icon: 'folder', route: '/folder' },
   { id: 'verified', label: 'Verified', icon: 'verified', route: '/verified' },
  { id: 'engineering', label: 'Engineering', icon: 'engineering', route: '/engineering' },
  { id: 'settings', label: 'Settings', icon: 'settings', route: '/settings' }
];

