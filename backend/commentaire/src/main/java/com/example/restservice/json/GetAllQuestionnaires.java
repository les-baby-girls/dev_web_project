package com.example.restservice.json;


import com.example.restservice.classe.Questionnaire;
import java.util.List;



public record GetAllQuestionnaires(List<Questionnaire> questionnaires  )  {

    

    public static GetAllQuestionnaires createQuestionnaire(List<Questionnaire> questionnaires) {
         
        
        
        return new GetAllQuestionnaires(questionnaires);
    }

    
}