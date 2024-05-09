package com.example.restservice.json;

import com.example.restservice.model.Post;

public record CreatePost(String result, Post post) {
    public static CreatePost createPost(String result, Post post) {
        return new CreatePost(result, post);
    }
}
