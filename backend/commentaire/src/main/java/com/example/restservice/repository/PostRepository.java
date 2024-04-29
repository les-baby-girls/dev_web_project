package com.example.restservice.repository;


import org.springframework.data.neo4j.repository.ReactiveNeo4jRepository;
import org.springframework.data.neo4j.repository.query.Query;
import org.springframework.data.repository.query.Param;

import com.example.restservice.model.Post;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;


public interface PostRepository extends ReactiveNeo4jRepository<Post, String> {
    @Query("MATCH (n:Post) RETURN n")
    Flux<Post> getAllPosts();

    @Query("CREATE (p:Post {post_id: $post_id}) RETURN p")
    Mono<Post> createPost(@Param("post_id") String id);

    @Query("MATCH (post:Post) WHERE post.post_id = $post_id RETURN post LIMIT 1")
    Mono<Post> findPostById(@Param("post_id") String postId);

    @Query("MATCH (p:Post {post_id: $postId})-[r:GET_COMMENTED]->(c:Comment) DELETE p, r, c")
    Mono<Void> delete_post(@Param("postId") String post_id);


}

