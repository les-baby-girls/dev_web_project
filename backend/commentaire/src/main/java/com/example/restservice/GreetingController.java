package com.example.restservice;


import java.util.Date;
import java.util.UUID;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.example.restservice.json.CreateCommentary;
import com.example.restservice.json.CreatePost;
import com.example.restservice.json.GetCommentsByPostId;
import com.example.restservice.model.Comment;
import com.example.restservice.model.Post;
import com.example.restservice.service.CommentService;
import com.example.restservice.service.PostService;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;


import org.springframework.web.bind.annotation.PathVariable;


@RestController
@CrossOrigin(origins = "*")
@ComponentScan(basePackages = "com.example.restservice.service")
public class GreetingController implements CommandLineRunner {


	private final PostService postService;
	private final CommentService commentService;

	public GreetingController(PostService postService, CommentService commentService) {
		this.postService = postService;
		this.commentService = commentService;
	}


	@GetMapping("/posts")
    public Flux<Post> getAllPost() {
        return postService.getAllPost();
    }

	

	@GetMapping("/post/{post_id}")
	public Mono<Post> getPost(@PathVariable String post_id) {
		return postService.getPost(post_id);
	}

	@PostMapping("/create/post")
	public CreatePost createPost(@RequestBody Post post) {
		return new CreatePost(postService.createPost(post).block());
	}

	@PostMapping("/create/comment/{post_id}")
	public CreateCommentary createCommentary(@PathVariable String post_id, @RequestBody Comment comment) {
		
		String commentId = UUID.randomUUID().toString();
		while (!this.commentService.CommentIdNotExists(commentId)) {
			commentId = UUID.randomUUID().toString();
		}
		comment.setComment_id(commentId);
		comment.setDate(new Date().toString());


		return new CreateCommentary(commentService.createCommentary(post_id, comment).block());
		

	}

	@GetMapping("/comments/{post_id}")
	public GetCommentsByPostId getComments(@PathVariable String post_id) {
		return new GetCommentsByPostId(commentService.getCommentByPostId(post_id).collectList().block());
	}

	@DeleteMapping("/delete/comment/{comment_id}")
	public Void deleteComment(@PathVariable String comment_id) {
		return commentService.deleteComment(comment_id).block();
	}

	@DeleteMapping("/delete/post/{post_id}")
	public Void deletePost(@PathVariable String post_id) {
		return postService.deletePost(post_id).block();
	}


	@GetMapping("/purge")
	public Void purge() {
		return commentService.purge().block();
	}




	
	
	
	

	
	
	

	public void run(String... args) throws Exception {

	}
}