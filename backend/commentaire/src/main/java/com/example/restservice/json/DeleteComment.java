package com.example.restservice.json;



public record DeleteComment(String processus) {
    public static DeleteComment deleteComment(String processus) {
        return new DeleteComment(processus);
    }
}
