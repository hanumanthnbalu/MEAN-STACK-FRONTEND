import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PostData } from './post-data.model';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
	providedIn: 'root'
})
export class PostService {
	private posts: PostData[] = [];
	private postsUpdated = new Subject<PostData[]>();
	constructor(private http: HttpClient, private router: Router) {}

	createPost(title: string, content: string, image: File) {
		const postData = new FormData();
		postData.append('title', title);
		postData.append('content', content);
		postData.append('image', image, title);
		this.http.post('http://localhost:3000/api/posts/post', postData).subscribe((responsePost) => {
			console.log(responsePost);
			this.postsUpdated.next([ ...this.posts ]);
			this.router.navigate([ '/' ]);
		});
	}

	getPosts(postPerPage:number, currentPage:number) {
    const queryParams = `?pagesize=${postPerPage}&page=${currentPage}`;
		this.http
			.get<{ message: string; post: any, count:number }>('http://localhost:3000/api/posts'+ queryParams)
			.pipe(
				map((postData) => {
          // console.log('transferData', postData.count);
					return { posts: postData.post.map((post) => {
						return {
							title: post.title,
							content: post.content,
							id: post._id,
							imagePath: post.imagePath
						};
          }),
          count: postData.count
        };
				})
			)
			.subscribe((transferData) => {
				this.posts = transferData.posts;
				this.postsUpdated.next([ ...this.posts ]);
			});
	}
	getPost(id: string) {
		// return { ...this.posts.find((post) => post.id === id) };
		return this.http.get<{ _id: string; title: string; content: string; imagePath: string }>(
			'http://localhost:3000/api/posts/post/' + id
		);
	}

	updatePost(id: string, title: string, content: string, image: File | string) {
		let postData: PostData | FormData;
		if (typeof image === 'object') {
			postData = new FormData();
			postData.append('id', id);
			postData.append('title', title);
			postData.append('content', content);
			postData.append('image', image, title);
		} else {
			postData = {
				id: id,
				title: title,
				content: content,
				imagePath: image
			};
		}
		this.http.put('http://localhost:3000/api/posts/post/' + id, postData).subscribe((updatedPost) => {
			console.log(updatedPost);
			this.postsUpdated.next([ ...this.posts ]);
			this.router.navigate([ '/' ]);
		});
	}

	getPostUpdatedListner() {
		return this.postsUpdated.asObservable();
	}

	deletePost(postId: string) {
		this.http.delete('http://localhost:3000/api/posts/post/' + postId).subscribe(() => {
			console.log('Deleted!', postId);
			this.postsUpdated.next([ ...this.posts ]);
			// this.getPosts();
			this.router.navigate([ '/' ]);
		});
	}
}
