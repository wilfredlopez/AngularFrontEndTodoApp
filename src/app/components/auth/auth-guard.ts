import { CanActivate, Router } from "@angular/router"
import { AuthService } from "src/app/services/auth.service"
import { Injectable } from "@angular/core"

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}
  canActivate(
    route: import("@angular/router").ActivatedRouteSnapshot,
    state: import("@angular/router").RouterStateSnapshot
  ):
    | boolean
    | import("@angular/router").UrlTree
    | import("rxjs").Observable<boolean | import("@angular/router").UrlTree>
    | Promise<boolean | import("@angular/router").UrlTree> {
    const auth = this.authService.getIfAuth()
    if (!auth) {
      this.router.navigate(["/"])
    }
    return auth
  }
}
