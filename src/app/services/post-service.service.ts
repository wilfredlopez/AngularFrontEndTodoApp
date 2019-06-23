import { Injectable } from "@angular/core"

//custom
import { Post } from "../components/models/post-model"
import { Subject } from "rxjs"
import { HttpClient, HttpHeaders } from "@angular/common/http"
import { map } from "rxjs/operators"
import { Router } from "@angular/router"
import { environment } from "src/environments/environment"

const serverURL = environment.BACKEND_URL

@Injectable({
  providedIn: "root"
})
export class PostService {
  private posts: Post[]
  private postsUpdated = new Subject<{ posts: Post[]; postCount: number }>()
  // private postsUpdated = new Subject<Post[]>()
  constructor(private http: HttpClient, private router: Router) {}

  getPosts(postsPerPage: number = 5, currentPage: number = 1) {
    const queryParams = `?pageSize=${postsPerPage}&page=${currentPage}`
    this.http
      .get<{ message: String; posts: any; maxPosts: number }>(
        `${serverURL}/api/posts${queryParams}`
      )
      .pipe(
        map(data => {
          return {
            posts: data.posts.map(post => {
              return {
                title: post.title,
                content: post.content,
                id: post._id,
                image: post.image,
                updatedAt: post.updatedAt,
                createdAt: post.createdAt,
                creator: post.creator._id,
                createdBy: post.creator.username
              }
            }),
            maxPosts: data.maxPosts
          }
        })
      )
      .subscribe(postsData => {
        this.posts = postsData.posts
        this.postsUpdated.next({
          posts: [...this.posts],
          postCount: postsData.maxPosts
        })
      })
  }

  addPost(title: string, content: string, image: File) {
    const post = new FormData()
    post.append("title", title)
    post.append("content", content)
    post.append("image", image)

    this.http
      .post<{ message: String; post: any }>(`${serverURL}/api/posts`, post)
      .subscribe(data => {
        this.posts.push({
          title: data.post.title,
          content: data.post.content,
          id: data.post._id,
          image: data.post.image,
          createdAt: data.post.createdAt,
          updatedAt: data.post.updatedAt,
          creator: data.post.creator._id,
          createdBy: data.post.creator.username
        })
        this.router.navigate(["/"])
      })
  }

  deletePost(id: String) {
    return this.http.delete(`${serverURL}/api/posts/${id}`)
    // .subscribe((data: any) => {
    //   const updatedPosts = this.posts.filter(post => post.id !== data.post._id)
    //   this.posts = updatedPosts
    //   this.postsUpdated.next([...this.posts])
    // })
  }

  getOnePost(id: String) {
    return this.http.get<{
      message: String
      data: any
      post: any
    }>(`${serverURL}/api/posts/${id}`)
  }

  updatePost(id: String, post) {
    let postData = new FormData()
    if (typeof post.image === "object") {
      postData.append("title", post.title)
      postData.append("content", post.content)
      postData.append("image", post.image)
    } else {
      postData = post
    }

    this.http
      .patch(`${serverURL}/api/posts/${id}`, postData)
      .subscribe((data: any) => {
        const postIndex = this.posts.findIndex(p => p.id === id)
        const updatedPosts = [...this.posts]
        updatedPosts[postIndex] = data.post
        this.posts = updatedPosts
        this.router.navigate(["/"])
      })
  }

  //make it available for listening in other files
  getPostListener() {
    return this.postsUpdated.asObservable()
  }
}
