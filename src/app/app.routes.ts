import { Routes } from '@angular/router';
import { ClientsComponent } from './pages/clients/clients.component';
import { DetailClientComponent } from './pages/clients/detail-client/detail-client.component';

export const routes: Routes = [
    // {
    //     path: "dashboard",
    //     component: DashboardComponent,
    //     loadChildren: () => import('./pages/dashboard/router-dashboard').then(m => m.routes_dashboard),
    // },
    { path: "clients", component: ClientsComponent },
    { path: "clients/:id", component: DetailClientComponent },
    { path: "", redirectTo: "clients", pathMatch: "full" },
    { path: "**", redirectTo: "clients", pathMatch: "full", },
];
