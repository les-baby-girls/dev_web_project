package com.example.restservice.classe;

public class Questionnaire {

    private String title;
    private String id;
 

    public Questionnaire(String id, String title) {
        this.title = title;
        this.id = id;
    
    }



    public String getTitle() {
        return title;
    }

    public String getId() {
        return id;
    }
}
