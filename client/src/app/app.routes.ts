import { Routes } from '@angular/router';
import { Homepage } from './homepage/homepage';
import { MenuPage } from './menu-page/menu-page';
import { AboutPage } from './about-page/about-page';
import { LoginPage } from './login-page/login-page';
import { Dashboard } from './dashboard/dashboard';
import { Cart } from './cart/cart';
import { DashboardPage } from './dashboard-page/dashboard-page';
import { Users } from './users/users';
import { Orders } from './orders/orders';
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
    },
    {
        path:'login',
        component:LoginPage
    },{
        path:'cart',
        component:Cart

    },{
        path:'dashboard',
        component:Dashboard,
        children:[
            {
                path:'',
                component:DashboardPage
            },
            {
                path:'users',
                component:Users
            }
        ]
    }
];
