import { Routes } from '@angular/router';
import { Homepage } from './homepage/homepage';
import { MenuPage } from './menu-page/menu-page';
import { AboutPage } from './about-page/about-page';
export const routes: Routes = [
    {
        path:'',
        component:Homepage
    },
    {
        path:'menu',
        component:MenuPage
    },
    {
        path:'about',
        component:AboutPage
    }
];
