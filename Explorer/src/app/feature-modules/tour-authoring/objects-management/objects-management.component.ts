import { Component, OnInit } from '@angular/core';
import { Object } from '../model/object.model';
import { ObjectUpdateComponent } from '../object-update/object-update.component';
import { MatDialog } from '@angular/material/dialog';
import { TourAuthoringService } from '../tour-authoring.service';
import { PagedResult } from '../../blog/blog.module';

@Component({
  selector: 'xp-objects-management',
  templateUrl: './objects-management.component.html',
  styleUrls: ['./objects-management.component.css']
})
export class ObjectsManagementComponent implements OnInit {
  objects: Object[] = []; // Full list of objects fetched from the backend
  filteredObjects: Object[] = []; // Filtered list displayed on the UI
  searchName: string = ''; // User-entered search term for object names
  selectedCategories: string[] = []; // List of selected categories for filtering
  showCategoryFilters: boolean = false; // Flag to toggle category filters UI

  constructor(private service: TourAuthoringService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.getObjects(); // Fetch objects on component initialization
  }

  /**
   * Fetch objects from the backend and initialize filtering.
   */
  getObjects(): void {
    this.service.getObjects().subscribe({
      next: (result: PagedResult<Object>) => {
        this.objects = result.results;
        this.filteredObjects = [...this.objects]; // Initialize filteredObjects
      },
      error: (err: any) => {
        console.error('Error fetching objects:', err);
      }
    });
  }

  /**
   * Triggered when the search input value changes.
   * Updates the search term and applies filters.
   */
  onSearchChange(): void {
    this.applyFilters();
  }

  /**
   * Triggered when the search icon is clicked.
   * Applies filters based on the search term and selected categories.
   */
  onSearchClick(): void {
    this.applyFilters();
  }

  /**
   * Triggered when a category filter checkbox is toggled.
   * Updates the list of selected categories and applies filters.
   */
  onCategoryChange(event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    const category = checkbox.value;

    if (checkbox.checked) {
      this.selectedCategories.push(category); // Add selected category
    } else {
      this.selectedCategories = this.selectedCategories.filter(
        (cat) => cat !== category
      ); // Remove unselected category
    }

    this.applyFilters(); // Apply filters after updating categories
  }

  /**
   * Toggles the visibility of category filter options.
   */
  toggleCategoryFilters(): void {
    this.showCategoryFilters = !this.showCategoryFilters;
  }

  /**
   * Applies filters to display objects matching the search term and selected categories.
   */
  applyFilters(): void {
    const searchLower = this.searchName.toLowerCase();

    this.filteredObjects = this.objects.filter((objek) => {
      const matchesName = objek.name.toLowerCase().includes(searchLower); // Filter by name
      const matchesCategory =
        this.selectedCategories.length === 0 || // No category filters applied
        this.selectedCategories.includes(objek.category); // Matches selected categories

      return matchesName && matchesCategory;
    });
  }

  /**
   * Opens a dialog to edit an object.
   * @param objek - The object to edit.
   */
  editObject(objek: Object): void {
    const dialogRef = this.dialog.open(ObjectUpdateComponent, {
      width: '400px',
      data: objek
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getObjects(); // Refresh the object list after editing
      }
    });
  }
}
