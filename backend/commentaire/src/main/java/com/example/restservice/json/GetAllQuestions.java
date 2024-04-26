package com.example.restservice.json;


import com.example.restservice.classe.Question;
import com.example.restservice.classe.Questionnaire;
import java.util.List;



public record GetAllQuestions(List<Question> qcm  )  {

    

    public static GetAllQuestions getAllQuestions(List<Question> qcm) {
         
        
        
        return new GetAllQuestions(qcm);
    }

    
}