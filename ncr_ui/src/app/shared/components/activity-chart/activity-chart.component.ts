import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { ChartModule,SeriesClickEvent } from '@progress/kendo-angular-charts';

@Component({
  selector: 'app-activity-chart',
  standalone: true,
  imports: [CommonModule, ChartModule],
  templateUrl: './activity-chart.component.html',
  styleUrl: './activity-chart.component.scss'
})
export class ActivityChartComponent implements OnChanges {
  @Input() data: any[] = [];
  @Output() barClick = new EventEmitter<any[]>();
  
  groupedChartData: { month: string; count: number }[] = [];
  categories: string[] = [];  // for x-axis
  values: number[] = [];      // for y-axis

  // ngOnInit(): void {
  //   this.groupedChartData = this.getMonthlyCounts(this.data);
    

  //   console.log('Grouped chart data:', this.groupedChartData); 
  // }

    ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']) {
      this.groupedChartData = this.getMonthlyCounts(this.data);
      this.categories = this.groupedChartData.map(item => item.month);
    this.values = this.groupedChartData.map(item => item.count);
    }
  }

  getMonthlyCounts(chartData: any[]): { month: string; count: number }[] {
    const monthMap = new Map<string, number>();

    chartData.forEach(item => {
      const date = new Date(item.createdDate);
      if (!item.createdDate || isNaN(date.getTime())) return;

      const key = `${date.getFullYear()}-${date.toLocaleString('en-US', { month: 'long' })}`;
      monthMap.set(key, (monthMap.get(key) || 0) + 1);
    });

    return Array.from(monthMap.entries())
      .map(([month, count]) => ({ month, count }))
      .sort((a, b) => {
        const [aYear, aMonth] = a.month.split('-');
        const [bYear, bMonth] = b.month.split('-');
        const aDate = new Date(`${aMonth} 1, ${aYear}`);
        const bDate = new Date(`${bMonth} 1, ${bYear}`);
        return aDate.getTime() - bDate.getTime();
      });
  }

onSeriesClick(e: any): void {
  const clickedCategory = e.category; // e.g. "2024-June"
  const filtered = this.data.filter(d => {
    const date = new Date(d.createdDate);
    const key = `${date.getFullYear()}-${date.toLocaleString('en-US', { month: 'long' })}`;
    return key === clickedCategory;
  });

  console.log('Bar clicked for category:', clickedCategory); 
  debugger;
  this.barClick.emit(filtered);
}

}