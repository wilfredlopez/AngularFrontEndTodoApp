import { BrowserModule } from "@angular/platform-browser"
import { NgModule } from "@angular/core"
import { ReactiveFormsModule, FormsModule } from "@angular/forms"

//custom
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http"
import { AppRoutingModule } from "./app-routing.module"
import { AppComponent } from "./app.component"
import { PostCreateComponent } from "./components/post/post-create/post-create.component"
import { BrowserAnimationsModule } from "@angular/platform-browser/animations"
import { HeaderComponent } from "./components/header/header.component"
import { PostListComponent } from "./components/post/post-list/post-list.component"

import { AuthInterceptor } from "./services/auth-interceptor"
import { ErrorInterceptor } from "./services/error-interceptor"
import { ErrorComponent } from "./components/error/error.component"
import { AngularMaterialModule } from "./ang-materia.module"

@NgModule({
  declarations: [
    AppComponent,
    PostCreateComponent,
    HeaderComponent,
    PostListComponent,
    ErrorComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    AngularMaterialModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
  ],
  bootstrap: [AppComponent],
  entryComponents: [ErrorComponent]
})
export class AppModule {}
