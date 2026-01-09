import { Component } from '@angular/core';
import { RouterOutlet, RouterLinkWithHref,RouterLinkActive,RouterLink} from '@angular/router';
import { CartService } from '../service/cart.service';

@Component({
  selector: 'app-dashboard',
  imports: [RouterOutlet, RouterLinkWithHref, RouterLinkActive, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  constructor(public cartService: CartService) {}
}
