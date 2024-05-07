package com.example.restservice.json;

import com.example.restservice.model.Comment;
import java.util.List;

public record GetCommentsByPostId(String result, List<Comment> ListeComment) {
    public static GetCommentsByPostId getCommentsByPostId(String result, List<Comment> ListeComment) {
        return new GetCommentsByPostId(result, ListeComment);
    }
}
