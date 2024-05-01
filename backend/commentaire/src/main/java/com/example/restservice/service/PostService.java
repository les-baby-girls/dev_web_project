package com.example.restservice.service;


import org.springframework.stereotype.Service;


import com.example.restservice.model.Post;
import com.example.restservice.repository.PostRepository;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Service
public class PostService {
	private final PostRepository postRepository;

	public PostService(PostRepository postRepository) {
		this.postRepository = postRepository;
	}
	
	public Flux<Post> getAllPost() {
		return postRepository.getAllPosts();
	}
	public Mono<Post> createPost(Post post) {
		return postRepository.createPost(post.getPost_id());
	}


	public Mono<Post> getPost(String id) {

		return postRepository.findPostById(id);
	}

	public Mono<Void> deletePost(String id) {
		return postRepository.delete_post(id);
	}

}