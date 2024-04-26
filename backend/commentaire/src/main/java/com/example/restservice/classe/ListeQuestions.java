package com.example.restservice.classe;


import java.util.List;
import java.util.ArrayList;
import java.util.HashMap;


public class ListeQuestions {

    protected  HashMap<String, List<Question>> qcm = new HashMap<>();

    public ListeQuestions() {

    
    }



    public void addQuestion(String questionnaire_id, String question, String choix1, String choix2, String choix3, String choix4, String reponse) {

        List<Question> questions = qcm.get(questionnaire_id);

        if (questions == null) {
            qcm.put(questionnaire_id, new ArrayList<Question>());
            questions = qcm.get(questionnaire_id);
        }

        questions.add(new Question(question, choix1, choix2, choix3, choix4, reponse));
        qcm.put(questionnaire_id, questions);
    }

    public List<Question> getQuestions(String questionnaire_id) {
        return qcm.get(questionnaire_id);
    }

    public void createqcm(String questionnaire_id) {
        List<Question> questions = qcm.get(questionnaire_id);

        if (questions == null) {
            qcm.put(questionnaire_id, new ArrayList<Question>());
        }
    }

    
}
