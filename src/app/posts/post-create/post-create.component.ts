  import { PostData } from './../post-data.model';
  import { Component, OnInit } from '@angular/core';
  import { FormGroup, FormControl, Validators } from '@angular/forms';
  import { PostService } from '../post.service';
  import { ActivatedRoute, ParamMap } from '@angular/router';
  import { mimeType } from './mime-type.validator';

  @Component({
    selector: 'app-post-create',
    templateUrl: './post-create.component.html',
    styleUrls: [ './post-create.component.scss' ]
  })
  export class PostCreateComponent implements OnInit {
    post: PostData;
    form: FormGroup;
    private mode = 'create';
    private postId: string;
    imagePreview: string | ArrayBuffer;
    constructor(private postService: PostService, private route: ActivatedRoute) {}

    ngOnInit() {
      this.form = new FormGroup({
        title: new FormControl(null, { validators: [ Validators.required, Validators.minLength(3) ] }),
        content: new FormControl(null, { validators: [ Validators.required ] }),
        image: new FormControl(null, { validators: [ Validators.required ], asyncValidators: [ mimeType ] })
      });
      this.route.paramMap.subscribe((paramMap: ParamMap) => {
        if (paramMap.has('postId')) {
          this.mode = 'edit';
          this.postId = paramMap.get('postId');
          // console.log(paramMap.get('postId'));
          this.postService.getPost(this.postId)
          .subscribe((postData) => {
            this.post = {
                _id: postData._id,
                title: postData.title,
                content: postData.content,
                imagePath: postData.imagePath,
                creator: postData.creator
            };
            this.form.setValue({
                title: this.post.title,
                content: this.post.content ,
                image: this.post.imagePath
            });
          });
        } else {
          this.mode = 'create';
          this.postId = null;
        }
      });
    }

    onImagePicked(event: Event) {
      const file = (event.target as HTMLInputElement).files[0];
      this.form.patchValue({ image: file });
      this.form.get('image').updateValueAndValidity();
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(file);
      // console.log(file);
      // console.log(this.form);
    }

    onSavePost() {
      if (this.form.invalid) {
        return;
      }
      if (this.mode === 'create') {
        this.postService.createPost(
          this.form.value.title,
          this.form.value.content,
          this.form.value.image
        );
      } else {
        this.postService.updatePost(
          this.postId,
          this.form.value.title,
          this.form.value.content,
          this.form.value.image
        );
      }
      this.form.reset();
    }
  }
