package com.example.restservice.json;

import com.example.restservice.model.Comment;


public record CreateCommentary(Comment comment) {
    public static CreateCommentary createCommentary(Comment comment) {
        return new CreateCommentary(comment);
    }
}
