package com.example.restservice.json;



public record CreateQuestion(String question, String choix1, String choix2, String choix3, String choix4, String reponse)  {

    

    public static CreateQuestion createQuestion(String question, String choix1, String choix2, String choix3, String choix4, String reponse) {
         
        

        return new CreateQuestion( question,  choix1,  choix2,  choix3,  choix4,  reponse);
    }

    
}