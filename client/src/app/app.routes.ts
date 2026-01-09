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
import { Products } from './products/products';
import { Customers } from './customers/customers';
import { DeliveryMen } from './delivery-men/delivery-men'
import { CustomerDetails } from './customer-details/customer-details';
import { OrderDetails } from './order-details/order-details';
import { DeliveryDetails } from './delivery-details/delivery-details';
import { ProductDetails } from './product-details/product-details';
import { SettingsPage } from './settings-page/settings-page';
import { CheckoutPage } from './checkout-page/checkout-page';
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
            },
            {
                path:'orders',
                component:Orders
            },
            {
                path:'products',
                component:Products
            },
            {
                path:'products/:id',
                component:ProductDetails
            },
            {
                path:'customers',
                component:Customers
            },
            {
                path:'customers/:id',
                component:CustomerDetails
            },
            {
                path:'delivery-men',
                component:DeliveryMen
            },
            {
                path:'delivery-men/:id',
                component:DeliveryDetails
            },
            {
                path:'orders/:id',
                component:OrderDetails
            },
            {
                path: 'settings',
                component: SettingsPage
            },
            {
                path: 'checkout',
                component: CheckoutPage
            }
        ]
    }
];
