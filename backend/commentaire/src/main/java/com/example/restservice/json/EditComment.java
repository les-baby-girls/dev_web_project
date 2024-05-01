package com.example.restservice.json;



public record EditComment(String processus) {
    public static EditComment editComment(String processus) {
        return new EditComment(processus);
    }
}
