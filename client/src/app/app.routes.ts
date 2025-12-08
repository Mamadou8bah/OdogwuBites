import { Routes } from '@angular/router';
import { Homepage } from './homepage/homepage';
import { MenuPage } from './menu-page/menu-page';

export const routes: Routes = [
    {
        path:'',
        component:Homepage
    },
    {
        path:'menu',
        component:MenuPage
    }
];
