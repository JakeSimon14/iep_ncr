import { Component } from '@angular/core';
import { HeaderComponent } from "../../shared/components/header/header.component";
import { SidebarMenuComponent } from "../../shared/components/sidebar-menu/sidebar-menu.component";
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ncr-layout',
  standalone: true,
  imports: [HeaderComponent, SidebarMenuComponent,CommonModule,RouterModule],
  templateUrl: './ncr-layout.component.html',
  styleUrl: './ncr-layout.component.scss'
})
export class NcrLayoutComponent {

constructor(private router: Router) {}

   onMenuChange(route: string): void {
    this.router.navigate([route]);
  }
}
