package com.example.restservice;

import java.util.Date;
import java.util.UUID;

import org.springframework.context.annotation.ComponentScan;

import org.springframework.web.bind.annotation.RestController;

import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.CrossOrigin;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.DeleteMapping;

import com.example.restservice.json.CreateCommentary;
import com.example.restservice.json.CreatePost;
import com.example.restservice.json.DeleteComment;
import com.example.restservice.json.DeletePost;
import com.example.restservice.json.EditComment;
import com.example.restservice.json.GetCommentsByPostId;

import com.example.restservice.model.Comment;
import com.example.restservice.model.Post;

import com.example.restservice.service.CommentService;
import com.example.restservice.service.PostService;


@RestController
@CrossOrigin(origins = "*")
@ComponentScan(basePackages = "com.example.restservice.service")
public class GreetingController {

	private final PostService postService;
	private final CommentService commentService;

	public GreetingController(PostService postService, CommentService commentService) {
		this.postService = postService;
		this.commentService = commentService;
	}

	@PostMapping("/create/post")
	public CreatePost createPost(@RequestBody Post post) {
		try {
			if (postService.getPost(post.getPost_id()).block() == null) {
				Post res = postService.createPost(post).block();
				if (res == null) {
					return new CreatePost("ERROR", res);
				}
				return new CreatePost("SUCCESS", res);
			} else {
				return null;
			}
		} catch (Exception e) {
			return new CreatePost("ERROR", null);
		}
	}

	@PostMapping("/create/comment/{post_id}")
	public CreateCommentary createCommentary(@PathVariable String post_id, @RequestBody Comment comment) {
		try {
			String commentId = UUID.randomUUID().toString();
			while (!this.commentService.CommentIdNotExists(commentId)) {
				commentId = UUID.randomUUID().toString();
			}
			comment.setComment_id(commentId);
			comment.setDate(new Date().toString());

			Comment res = commentService.createCommentary(post_id, comment).block();

			if (res == null) {
				return new CreateCommentary("ERROR", res);
			}
			return new CreateCommentary("SUCCESS", res);

		} catch (Exception e) {
			return new CreateCommentary("ERROR", null);
		}

	}

	@GetMapping("/comments/{post_id}")
	public GetCommentsByPostId getComments(@PathVariable String post_id) {
		try {
			return new GetCommentsByPostId("SUCCESS", commentService.getCommentByPostId(post_id).collectList().block());
		} catch (Exception e) {
			return new GetCommentsByPostId("ERROR", null);
		}

	}

	@DeleteMapping("/delete/comment/{comment_id}")
	public DeleteComment deleteComment(@PathVariable String comment_id) {
		try {

			if (!commentService.CommentIdNotExists(comment_id)) {
				commentService.deleteComment(comment_id).block();
				return DeleteComment.deleteComment("SUCCESS");
			} else {
				return DeleteComment.deleteComment("ERROR");
			}
		} catch (Exception e) {
			return new DeleteComment("ERROR");
		}
	}

	@DeleteMapping("/delete/post/{post_id}")
	public DeletePost deletePost(@PathVariable String post_id) {
		try {
			if (postService.getPost(post_id).block() != null) {
				postService.deletePost(post_id).block();
				return DeletePost.deletePost("SUCCESS");
			} else {
				return DeletePost.deletePost("ERROR");
			}
		} catch (Exception e) {
			return new DeletePost("ERROR");
		}
	}

	@PutMapping("edit/comment/{comment_id}")
	public EditComment editComment(@PathVariable String comment_id, @RequestBody Comment editedText) {
		try {
			if (!commentService.CommentIdNotExists(comment_id)) {
				commentService.editComment(comment_id, editedText.getText()).block();
				return EditComment.editComment("SUCCESS");
			} else {
				return EditComment.editComment("ERROR");
			}
		} catch (Exception e) {
			return new EditComment("ERROR");
		}

	}

}