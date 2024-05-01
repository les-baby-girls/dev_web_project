package com.example.restservice.json;

import com.example.restservice.model.Comment;
import java.util.List;

public record GetCommentsByPostId(List<Comment> ListeComment) {
    public static GetCommentsByPostId getCommentsByPostId(List<Comment> ListeComment) {
        return new GetCommentsByPostId(ListeComment);
    }
}
