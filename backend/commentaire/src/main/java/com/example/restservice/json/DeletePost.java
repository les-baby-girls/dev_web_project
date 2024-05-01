package com.example.restservice.json;


public record DeletePost(String processus) {
    public static DeletePost deletePost(String processus) {
        return new DeletePost(processus);
    }
}
