import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { ConstOtrDashboardMenu, OtrMenuItem } from '../../../model/menu-config.model';

@Component({
  selector: 'app-sidebar-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar-menu.component.html',
  styleUrl: './sidebar-menu.component.scss'
})
export class SidebarMenuComponent {

  
@Output() selectionChange = new EventEmitter<string>();
  menuItems: OtrMenuItem[] = ConstOtrDashboardMenu;
  selectedId = this.menuItems[0].id;

  constructor(private router: Router) {}

  select(item: OtrMenuItem): void {
    this.selectedId = item.id;
    this.selectionChange.emit(item.route);
    this.router.navigate([item.route]);
  }
}
