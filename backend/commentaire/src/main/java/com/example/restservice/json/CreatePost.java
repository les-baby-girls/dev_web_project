package com.example.restservice.json;

import com.example.restservice.model.Post;


public record CreatePost(Post post) {
    public static CreatePost createPost(Post post) {
        return new CreatePost(post);
    }
}
