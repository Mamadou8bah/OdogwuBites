import { Injectable } from '@angular/core';
import { Homepage as HomepageService } from '../service/homepage';


@Injectable({
  providedIn: 'root',
})
export class MenuPageService {

  private menuItems: any[] = [];

  constructor(private homepageService: HomepageService) { 
    this.menuItems = homepageService.getMenuItems();
  }
  getMenuItems(): any[] {
    return this.menuItems;
  }

  addToCart(menuItemId:String):void{
    //To Be Implemented
  }
  removeFromCart(menuItemId:String):void{
    //To Be Implemented
  }
  checkOut():void{
    //To Be Implemented
  }
  clearCart():void{
    //To Be Implemented
  }
  
}
