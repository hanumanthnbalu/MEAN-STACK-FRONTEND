import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import { PostCreateComponent } from './post-create/post-create.component';
import { PostListComponent } from './post-list/post-list.component';
import { NgMaterialModule } from '../ng-material.module';

@NgModule({
	declarations: [
    PostCreateComponent,
    PostListComponent
  ],
	imports: [
    CommonModule,
    ReactiveFormsModule,
    NgMaterialModule,
    RouterModule
	]
})
export class PostsModule {}
