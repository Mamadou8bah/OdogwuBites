import { Routes } from '@angular/router';
import { Homepage } from './homepage/homepage';
import { MenuPage } from './menu-page/menu-page';
import { AboutPage } from './about-page/about-page';
import { LoginPage } from './login-page/login-page';
import { Dashboard } from './dashboard/dashboard';
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
import { authChildGuard, authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/role.guard';
import { guestGuard } from './guards/guest.guard';
import { Payments } from './payments/payments';
import { Wildcard } from './wildcard/wildcard';
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
        component:LoginPage,
        canActivate: [guestGuard]
    },{
        path:'dashboard',
        component:Dashboard,
        canActivate: [authGuard],
        canActivateChild: [authChildGuard],
        children:[
            {
                path:'',
                component:DashboardPage,
                canActivate:[adminGuard]
            },
            {
                path:'users',
                component:Users,
                canActivate: [adminGuard]
            },
            {
                path:'orders',
                component:Orders
            },
            {
                path:'products',
                component:Products,
                canActivate: [adminGuard]
            },
            {
                path:'products/:id',
                component:ProductDetails,
                canActivate: [adminGuard]
            },
            {
                path:'customers',
                component:Customers,
                canActivate: [adminGuard]
            },
            {
                path:'customers/:id',
                component:CustomerDetails,
                canActivate: [adminGuard]
            },
            {
                path:'delivery-men',
                component:DeliveryMen,
                canActivate: [adminGuard]
            },
            {
                path:'delivery-men/:id',
                component:DeliveryDetails,
                canActivate: [adminGuard]
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
            },
            {
                path:'payments',
                component:Payments
            }
        ]
    },
    {
        path:'**',
        component:Wildcard
    }
];
