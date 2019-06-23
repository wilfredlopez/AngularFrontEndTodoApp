import { Component, OnInit } from "@angular/core"
import { PostService } from "../../../services/post-service.service"

import { Post } from "../../models/post-model"
import { Subscription } from "rxjs"
import { PageEvent } from "@angular/material"
import { AuthService } from "src/app/services/auth.service"

@Component({
  selector: "app-post-list",
  templateUrl: "./post-list.component.html",
  styleUrls: ["./post-list.component.css"]
})
export class PostListComponent implements OnInit {
  posts: Post[] = []
  public isLoading: Boolean = true
  private postSub: Subscription //to create subscription to post-service
  totalPost = 3
  postsPerPage = 5
  currentPage = 1
  pageOptions = [1, 5, 10, 15]
  authServiceSub: Subscription
  userAthenticated = false
  userInfo: Object

  //added public to have it available in the class
  constructor(
    public postService: PostService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.userAthenticated = this.authService.getIfAuth()
    this.authServiceSub = this.authService.authStatusListenter.subscribe(
      authStatus => {
        this.userAthenticated = authStatus
        this.userInfo = this.authService.getUserInfo()
      }
    )
    this.userInfo = this.authService.getUserInfo()
    this.postService.getPosts(this.postsPerPage, this.currentPage)
    this.postSub = this.postService
      .getPostListener()
      .subscribe((postData: { posts: Post[]; postCount: number }) => {
        this.posts = postData.posts
        this.totalPost = postData.postCount
        this.isLoading = false
      })
  }

  onDelete(id: String) {
    this.isLoading = true
    this.postService.deletePost(id).subscribe(
      () => {
        this.postService.getPosts(this.postsPerPage, this.currentPage)
      },
      error => {
        this.isLoading = false
      }
    )
  }

  onChangePage(pageData: PageEvent) {
    this.isLoading = true
    this.currentPage = pageData.pageIndex + 1
    this.postsPerPage = pageData.pageSize

    this.postService.getPosts(this.postsPerPage, this.currentPage)
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.postSub.unsubscribe()
    this.authServiceSub.unsubscribe()
  }
}
