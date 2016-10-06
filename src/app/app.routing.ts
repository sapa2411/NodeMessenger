import { ModuleWithProviders }  from "@angular/core";
import { RouterModule, Routes }  from "@angular/router";
import { DialogComponent } from "./dialog.component";
import { DialogListComponent } from "./dialog-list.component";
import { AppComponent } from "./app.component";
import { LoginComponent } from "./login.component";

const routes: Routes = [
  {
    path: "dialog/:id/:type/:title",
    component: DialogComponent
  },
  {
    path: "dialogs",
    component: DialogListComponent
  },
  {
    path: "authorize",
    component: LoginComponent
  },
  {
    path: "",
    redirectTo: "/dialogs",
    pathMatch: "full"
  },
  {
    path: "popup.html",
    redirectTo: "/dialogs",
    pathMatch: "full"
  }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes);
