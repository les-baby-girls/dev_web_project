package com.example.restservice.classe;

import java.util.List;
import java.util.ArrayList;


public class ListeQuestionnaire {

    protected  List<Questionnaire> questionnaires = new ArrayList<>();

    public ListeQuestionnaire() {

    
    }



    public void addQuestionnaire(String id, String title) {
        questionnaires.add(new Questionnaire(id, title));
    }

    public List<Questionnaire> getQuestionnaires() {
        return questionnaires;
    }

    public Questionnaire getQuestionnaire(String id) {
        for (Questionnaire questionnaire : questionnaires) {
            if (questionnaire.getId().equals(id)) {
                return questionnaire;
            }
        }
        return null;
    }

    
}
