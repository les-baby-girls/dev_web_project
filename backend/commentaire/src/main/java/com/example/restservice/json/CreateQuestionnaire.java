package com.example.restservice.json;



public record CreateQuestionnaire(String title, String id)  {

    

    public static CreateQuestionnaire createQuestionnaire(String title, String id) {
         
        

        return new CreateQuestionnaire(title, id);
    }

    
}