import { CommonModule } from "@angular/common";
import { AfterViewInit, Component, EventEmitter, Input, Output} from "@angular/core";
import { FilterService } from "@progress/kendo-angular-grid";
import { KENDO_INPUTS } from "@progress/kendo-angular-inputs";
import { KENDO_LABEL } from "@progress/kendo-angular-label";
import { distinct,filterBy, FilterDescriptor} from "@progress/kendo-data-query";

interface CompositeFilterDescriptor {
  logic: "or" | "and";
  filters: Array<any>;
}

@Component({
  selector: 'multicheck-filter',
  standalone: true,
  imports: [KENDO_LABEL, KENDO_INPUTS, CommonModule],
  templateUrl: './multi-checkbox-filter.component.html',
  styleUrl: './multi-checkbox-filter.component.scss'
})
export class MultiCheckboxFilterComponent implements AfterViewInit {
@Input() public isPrimitive!: boolean;
@Input() public currentFilter!: CompositeFilterDescriptor;
@Input() public data!: unknown[];
@Input() public textField!: string;
@Input() public valueField!: string;
@Input() public filterService!: FilterService;
@Input() public field!: string;

  @Output() public valueChange = new EventEmitter<number[]>();

public currentData: unknown[] = [];

  public showFilter = true;
  private value: unknown[] = [];

  public textAccessor = (dataItem: unknown): string =>
  this.isPrimitive ? (dataItem as string) : (dataItem as Record<string, any>)[this.textField];

public valueAccessor = (dataItem: unknown): unknown =>
  this.isPrimitive ? dataItem : (dataItem as Record<string, any>)[this.valueField];

ngAfterViewInit(): void {
  this.currentData = this.data ?? [];


  const filters = (this.currentFilter?.filters ?? []) as FilterDescriptor[];

  this.value = filters.map((f) => f.value);

  if (this.currentData.length > 0) {
    this.showFilter = typeof this.textAccessor(this.currentData[0]) === 'string';
  }
}


 public isItemSelected(item: unknown): boolean {
  const itemValue = this.valueAccessor(item);
  return this.value.includes(itemValue);
}


public onSelectionChange(item: unknown, li: HTMLLIElement): void {
  const itemValue = this.valueAccessor(item);

  if (this.value.includes(itemValue)) {
    this.value = this.value.filter(x => x !== itemValue);
  } else {
    this.value.push(itemValue);
  }

  this.filterService.filter({
    logic: "or",
    filters: this.value.map((val) => ({
      field: this.field,
      operator: "eq",
      value: val
    }))
  });

  this.onFocus(li);
}


  public onInput(e: Event): void {
    this.currentData = distinct(
      [
        ...this.currentData.filter((dataItem) =>
          this.value.some((val) => val === this.valueAccessor(dataItem))
        ),
        ...filterBy(this.data, {
          operator: "contains",
          field: this.textField,
          value: (e.target as HTMLInputElement).value,
        }),
      ],
      this.textField
    );
  }

  public onFocus(li: HTMLLIElement): void {
    const ul = li.parentNode as HTMLUListElement;
    const below =
      ul.scrollTop + ul.offsetHeight < li.offsetTop + li.offsetHeight;
    const above = li.offsetTop < ul.scrollTop;

    
    if (above) {
      ul.scrollTop = li.offsetTop;
    }

    if (below) {
      ul.scrollTop += li.offsetHeight;
    }
  }
}
