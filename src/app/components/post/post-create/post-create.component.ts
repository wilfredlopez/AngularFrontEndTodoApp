import { Component, OnInit, OnDestroy } from "@angular/core"

import { FormGroup, FormControl, Validators } from "@angular/forms"
import { PostService } from "../../../services/post-service.service"
import { ActivatedRoute, ParamMap } from "@angular/router"
import { Post } from "../../models/post-model"

import { mimeType } from "./mime-type-validator"
import { AuthService } from "src/app/services/auth.service"
import { Subscription } from "rxjs"

@Component({
  selector: "app-post-create",
  templateUrl: "./post-create.component.html",
  styleUrls: ["./post-create.component.css"]
})
export class PostCreateComponent implements OnInit, OnDestroy {
  // @Output() postCreate = new EventEmitter<Post>()
  private mode = "create"
  private postId: String
  post: Post
  isLoading: Boolean
  form: FormGroup
  imagePreview: String | ArrayBuffer

  constructor(
    public postService: PostService,
    public route: ActivatedRoute,
    private authService: AuthService
  ) {}
  private authStatusSub: Subscription

  ngOnInit() {
    this.authStatusSub = this.authService
      .getAuthStatus()
      .subscribe(authStatus => {
        this.isLoading = false
      })
    this.isLoading = true
    this.form = new FormGroup({
      title: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      content: new FormControl(null, { validators: [Validators.required] }),
      image: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType]
      })
    })

    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has("id")) {
        this.mode = "edit"
        this.postId = paramMap.get("id")
        this.postService.getOnePost(this.postId).subscribe(
          data => {
            this.isLoading = false
            this.post = {
              id: data.post._id,
              title: data.post.title,
              content: data.post.content,
              image: data.post.image,
              createdAt: data.post.createdAt,
              updatedAt: data.post.updatedAt,
              creator: data.post.creator._id,
              createdBy: data.post.creator.username
            }
            this.form.setValue({
              title: this.post.title,
              content: this.post.content,
              image: this.post.image
            })
          },
          error => {
            this.isLoading = false
          }
        )
      } else {
        this.mode = "create"
        this.postId = null
        this.isLoading = false
      }
    })
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0]
    this.form.patchValue({ image: file })
    this.form.get("image").updateValueAndValidity()

    const reader = new FileReader()

    reader.onload = () => {
      this.imagePreview = reader.result
    }
    reader.readAsDataURL(file)
  }

  onAddPost() {
    if (this.form.invalid) {
      return
    }
    this.isLoading = true
    if (this.mode === "create") {
      this.postService.addPost(
        this.form.value.title,
        this.form.value.content,
        this.form.value.image
      )
      this.form.reset()
    } else {
      const post = {
        title: this.form.value.title,
        content: this.form.value.content,
        image: this.form.value.image
      }
      this.postService.updatePost(this.postId, post)
    }
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe()
  }
}
