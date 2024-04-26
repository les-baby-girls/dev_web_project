package com.example.restservice.json;


import com.example.restservice.classe.Question;
import com.example.restservice.classe.Questionnaire;
import java.util.List;



public record GetQuestionnaire(Questionnaire qcm  )  {

    

    public static GetQuestionnaire getQuestionnaire(Questionnaire qcm) {
         
        
        
        return new GetQuestionnaire(qcm);
    }

    
}