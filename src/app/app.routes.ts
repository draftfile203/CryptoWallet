import { Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DepositComponent } from './deposit/deposit.component';
import { AdminpanelComponent } from './adminpanel/adminpanel.component';
import { ChatComponent } from './chat/chat.component';
import { AdminChatComponent } from './admin-chat/admin-chat.component';



export const routes: Routes = [
    {path: "", component: HomeComponent},
    {path: "register", component:RegisterComponent},
    {path: "login", component:LoginComponent},
    {path: "dashboard", component:DashboardComponent},
    {path: "main", component:HomeComponent},
    {path:"deposit", component: DepositComponent},
    {path: "adminpanels", component:AdminpanelComponent},
    {path: "chat", component: ChatComponent},
    {path: "adminchat", component:AdminChatComponent}
];
