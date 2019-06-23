import { Injectable } from "@angular/core"
import { HttpClient } from "@angular/common/http"
import { Subject } from "rxjs"
import { Router } from "@angular/router"

import { environment } from "src/environments/environment"

const serverURL = environment.BACKEND_URL

@Injectable({
  providedIn: "root"
})
export class AuthService {
  private token: string
  public authStatusListenter = new Subject<boolean>()
  isAuthenticatd = false
  expiresInDuration: number
  private tokenTimer: any
  private userInfo: Object

  constructor(private http: HttpClient, private router: Router) {}

  createUser(email: string, password: string, username: string) {
    const requestData = { email, password, username }
    this.http
      .post<{ token: string }>(`${serverURL}/api/users/register`, requestData)
      .subscribe(
        res => {
          this.token = res.token
          this.router.navigate(["/auth/login"])
        },
        error => {
          console.warn(error)
          this.authStatusListenter.next(false)
        }
      )
  }

  getUserInfo() {
    return this.userInfo
  }

  loginUser(email: string, password: string) {
    const requestData = { email, password }
    this.http
      .post<{
        token: string
        expiresIn: number
        userId: string
        username: string
      }>(`${serverURL}/api/users/login`, requestData)
      .subscribe(
        res => {
          if (res.token) {
            this.token = res.token
            this.expiresInDuration = res.expiresIn
            this.setAuthTimer(this.expiresInDuration)
            this.isAuthenticatd = true
            this.userInfo = {
              userId: res.userId,
              username: res.username
            }
            const now = new Date()
            const expirationTime = new Date(
              now.getTime() + this.expiresInDuration * 1000
            )
            this.saveAuthData(
              this.token,
              expirationTime,
              res.userId,
              res.username
            )
            this.authStatusListenter.next(true)
            this.router.navigate(["/"])
          }
        },
        error => {
          console.warn(error)
          this.authStatusListenter.next(false)
        }
      )
  }

  private saveAuthData(
    token: string,
    expirationDate: Date,
    userId: string,
    username: string
  ) {
    localStorage.setItem("token", token)
    localStorage.setItem("userId", userId)
    localStorage.setItem("username", username)
    localStorage.setItem("expiration", expirationDate.toISOString())
  }

  private clearAuthData() {
    localStorage.removeItem("token")
    localStorage.removeItem("userId")
    localStorage.removeItem("username")
    localStorage.removeItem("expiration")
  }

  getToken() {
    return this.token
  }

  private setAuthTimer(duration: number) {
    this.tokenTimer = setTimeout(() => {
      this.logout()
    }, duration * 1000)
  }

  autoAuthUser() {
    const authInformation = this.getLocalAuthData()
    if (!authInformation) {
      return
    }
    const now = new Date()
    const expiresIn = authInformation.expiresIn.getTime() - now.getTime()

    if (expiresIn > 0) {
      this.token = authInformation.token
      this.isAuthenticatd = true
      this.userInfo = {
        userId: authInformation.userId,
        username: authInformation.username
      }
      this.setAuthTimer(expiresIn / 1000)
      this.authStatusListenter.next(true)
    }
  }

  getAuthStatus() {
    return this.authStatusListenter.asObservable()
  }

  getLocalAuthData() {
    const token = localStorage.getItem("token")
    const userId = localStorage.getItem("userId")
    const username = localStorage.getItem("username")
    const expiraton = localStorage.getItem("expiration")

    if (!token || !expiraton || !userId || !username) {
      return
    }
    console.log(token)
    return {
      token: token,
      userId: userId,
      expiresIn: new Date(expiraton),
      username: username
    }
  }

  logout() {
    this.token = null
    this.isAuthenticatd = false
    this.authStatusListenter.next(false)
    this.clearAuthData()
    this.userInfo = null
    clearTimeout(this.tokenTimer)
    this.router.navigate(["/"])
  }

  getIfAuth() {
    return this.isAuthenticatd
  }
}
