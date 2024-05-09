package com.example.restservice.json;


public record DeletePost(String result) {
    public static DeletePost deletePost(String result) {
        return new DeletePost(result);
    }
}
