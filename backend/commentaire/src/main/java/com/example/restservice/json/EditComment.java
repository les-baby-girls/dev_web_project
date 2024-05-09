package com.example.restservice.json;



public record EditComment(String result) {
    public static EditComment editComment(String result) {
        return new EditComment(result);
    }
}
