import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Homepage as HomepageService } from '../service/homepage';

@Component({
  selector: 'app-homepage',
  imports: [CommonModule],
  templateUrl: './homepage.html',
  styleUrl: './homepage.css',
})
export class Homepage {
  menuItems:Array<any> = [];
  firstMenuItems:Array<any> = [];
  favoriteItems:Array<any> = [];
  selectedMenuItems: Array<any> = [];

  selectedCategory: string = 'All';

  constructor(private homepageService: HomepageService) {
    this.menuItems = this.homepageService.getMenuItems();
    this.firstMenuItems=this.homepageService.getMenuItems().slice(0,4);
    this.favoriteItems=this.homepageService.getFavoriteItems();
    this.selectedMenuItems=this.menuItems.slice(0,6);
  }

  toggleCategory(category: string) {
    this.selectedCategory = category;
    if (category === 'All') {
      this.selectedMenuItems = this.homepageService.getMenuItems().slice(0,6);
    } else {
      this.selectedMenuItems = this.homepageService.getMenuItems().filter(item => item.categoryName === category).slice(0,6);
    }
  }

  
}
