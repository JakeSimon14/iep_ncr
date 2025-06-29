import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
showProfileMenu = false;
  
constructor(private router: Router) {}

logout(event: MouseEvent): void {
    event.stopPropagation(); // Prevent profile menu toggle
    this.showProfileMenu = false;
    localStorage.removeItem('token');

    localStorage.removeItem('GridFiltersData');
    localStorage.removeItem('GridFilters');

     localStorage.removeItem('ContractTreeFilters');

    this.router.navigate(['/login']);
  }

   toggleProfileMenu(): void {
    this.showProfileMenu = !this.showProfileMenu;
  }
}
