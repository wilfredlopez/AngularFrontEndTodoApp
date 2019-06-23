import { NgModule } from "@angular/core"
import { Routes, RouterModule } from "@angular/router"

import { PostListComponent } from "./components/post/post-list/post-list.component"
import { PostCreateComponent } from "./components/post/post-create/post-create.component"
import { AuthGuard } from "./components/auth/auth-guard"

const routes: Routes = [
  {
    path: "",
    component: PostListComponent
  },
  {
    path: "create",
    component: PostCreateComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "edit/:id",
    component: PostCreateComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "auth",
    //lazy loading this module that its own children routes
    loadChildren: "./components/auth/auth.module#WilfredAuthModule"
  }
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule {}
