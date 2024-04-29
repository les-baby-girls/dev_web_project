package com.example.restservice.repository;

import org.springframework.data.neo4j.repository.ReactiveNeo4jRepository;
import org.springframework.data.neo4j.repository.query.Query;
import org.springframework.data.repository.query.Param;

import com.example.restservice.model.Comment;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;


public interface CommentRepository extends ReactiveNeo4jRepository<Comment, String> {
    @Query("MATCH (c:Comment {comment_id: $commentId}) RETURN count(c) as commentCount")
    Mono<Long> countCommentsById(@Param("commentId") String id);

    @Query("MATCH (c:Comment {comment_id: $commentId}) RETURN c LIMIT 1")
    Mono<Comment> getCommentById(@Param("commentId") String id);

    @Query("MATCH (p:Post {post_id: $postId})-[r:GET_COMMENTED]->(c:Comment) RETURN c")
    Flux<Comment> getCommentsByPostId(@Param("postId") String id);

    @Query("MATCH (p:Post {post_id: $postId}) CREATE (c:Comment {comment_id: $id, author: $author, text: $text, date: $date}) CREATE (p)-[:GET_COMMENTED]->(c) RETURN c")
    Mono<Comment> createComment(@Param("postId") String post_id, @Param("id") String comment_id, @Param("author") String author, @Param("text") String text, @Param("date") String date);

    @Query("MATCH (n) DETACH DELETE n")
    Mono<Void> destroy();

    @Query("MATCH (p:Post)-[r:GET_COMMENTED]->(c:Comment {comment_id: $commentId}) DELETE r, c")
    Mono<Void> delete_comment(@Param("commentId") String comment_id);

    
}
