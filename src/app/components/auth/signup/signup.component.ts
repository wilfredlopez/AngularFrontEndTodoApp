import { Component, OnInit, OnDestroy } from "@angular/core"
import { NgForm } from "@angular/forms"
import { AuthService } from "src/app/services/auth.service"
import { Subscription } from "rxjs"

@Component({
  selector: "app-signup",
  templateUrl: "./signup.component.html",
  styleUrls: ["./signup.component.css"]
})
export class SignupComponent implements OnInit, OnDestroy {
  isLoading = false
  authStatusSub: Subscription

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authStatusSub = this.authService
      .getAuthStatus()
      .subscribe(authStatus => {
        this.isLoading = false
      })
  }

  onSignUp(form: NgForm) {
    this.isLoading = true
    if (form.invalid) {
      console.log("INVALID")
      return
    }

    this.authService.createUser(
      form.value.email,
      form.value.password,
      form.value.username
    )
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe()
  }
}
