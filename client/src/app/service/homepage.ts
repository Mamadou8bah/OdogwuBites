import { Injectable } from '@angular/core';

import { menuItems } from '../data/menu-items';

@Injectable({
  providedIn: 'root',
})
export class Homepage {
  getMenuItems() {
    return menuItems;
  }
  getFavoriteItems() {
    return menuItems.sort((item,item2) => item2.rating - item.rating).slice(0,4);
  }
}
