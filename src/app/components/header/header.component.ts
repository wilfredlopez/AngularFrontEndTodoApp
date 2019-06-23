import { Component, OnInit, OnDestroy } from "@angular/core"
import { AuthService } from "src/app/services/auth.service"
import { Subscription } from "rxjs"

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.css"]
})
export class HeaderComponent implements OnInit, OnDestroy {
  userAthenticated = false
  userInfo: Object
  private authStatusListenter: Subscription
  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.userAthenticated = this.authService.getIfAuth()
    this.userInfo = this.authService.getUserInfo()
    this.authStatusListenter = this.authService.authStatusListenter.subscribe(
      authStatus => {
        this.userAthenticated = authStatus
        this.userInfo = this.authService.getUserInfo()
      }
    )
  }

  onLogout() {
    this.authService.logout()
  }
  ngOnDestroy() {
    this.authStatusListenter.unsubscribe()
  }
}
