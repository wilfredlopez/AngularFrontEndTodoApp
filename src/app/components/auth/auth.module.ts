import { NgModule } from "@angular/core"
import { LoginComponent } from "./login/login.component"
import { SignupComponent } from "./signup/signup.component"
import { CommonModule } from "@angular/common"
import { AngularMaterialModule } from "src/app/ang-materia.module"
import { FormsModule } from "@angular/forms"
import { AuthRoutesModule } from "./auth-routing"

@NgModule({
  declarations: [LoginComponent, SignupComponent],
  imports: [CommonModule, AngularMaterialModule, FormsModule, AuthRoutesModule]
})
export class WilfredAuthModule {}
