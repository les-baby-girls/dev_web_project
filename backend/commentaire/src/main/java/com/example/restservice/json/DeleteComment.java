package com.example.restservice.json;



public record DeleteComment(String result) {
    public static DeleteComment deleteComment(String result) {
        return new DeleteComment(result);
    }
}
