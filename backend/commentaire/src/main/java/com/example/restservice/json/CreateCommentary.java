package com.example.restservice.json;

import com.example.restservice.model.Comment;

public record CreateCommentary(String result, Comment comment) {
    public static CreateCommentary createCommentary(String result, Comment comment) {
        return new CreateCommentary(result, comment);
    }
}
