package com.example.restservice.service;


import org.springframework.stereotype.Service;


import com.example.restservice.model.Comment;
import com.example.restservice.repository.CommentRepository;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Service
public class CommentService {
	private final CommentRepository commentRepository;

	public CommentService(CommentRepository commentRepository) {
		this.commentRepository = commentRepository;
	}

	public Mono<Comment> getCommentById(String commentId) {
		return commentRepository.getCommentById(commentId);
	}
	
	public Flux<Comment> getCommentByPostId(String postId) {
		return commentRepository.getCommentsByPostId(postId);
	}

	public boolean CommentIdNotExists(String commentId) {
		return commentRepository.countCommentsById(commentId).block().toString().equals("0");
	}

	public Mono<Comment> createCommentary(String postId, Comment comments) {
		return commentRepository.createComment(postId, comments.getComment_id(), comments.getAuthor(), comments.getText(), comments.getDate());
	}

	public Mono<Void> purge() {
		return commentRepository.destroy();
	}

	public Mono<Void> deleteComment(String commentId) {
		return commentRepository.delete_comment(commentId);
	}



}