package com.example.restservice;

import java.util.concurrent.atomic.AtomicLong;
import java.util.HashMap;
import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.boot.CommandLineRunner;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.restservice.json.CreateQuestion;
import com.example.restservice.json.CreateQuestionnaire;

import com.example.restservice.classe.Questionnaire;

import java.util.concurrent.atomic.AtomicLong;

import com.example.restservice.json.GetAllQuestionnaires;
import com.example.restservice.json.GetAllQuestions;
import com.example.restservice.json.GetQuestionnaire;
import com.example.restservice.classe.ListeQuestionnaire;
import com.example.restservice.classe.ListeQuestions;
import com.example.restservice.classe.Question;

import org.springframework.web.bind.annotation.PathVariable;
import java.util.List;

@RestController
public class GreetingController implements CommandLineRunner {


	protected ListeQuestionnaire questionnaires = new ListeQuestionnaire();

	protected ListeQuestions question = new ListeQuestions();

	private final AtomicLong counter = new AtomicLong();

	@PostMapping("/create/questionnaire")
	public CreateQuestionnaire createQuestionnaire(@RequestBody Questionnaire questionnaireRequest) {

		String id = String.valueOf(counter.incrementAndGet());

		CreateQuestionnaire questionnaire = CreateQuestionnaire.createQuestionnaire(id,
				questionnaireRequest.getTitle());

		question.createqcm(id);

		questionnaires.addQuestionnaire(id, questionnaireRequest.getTitle());

		return questionnaire;
	}

	@GetMapping("/")
	public String getAllAlbums() {
		return "Hello, world!";

	}
	
	@CrossOrigin(origins = "http://localhost:4200/")
	@GetMapping("/questionnaires")
	public GetAllQuestionnaires getAllQuestionnaires() {
		return GetAllQuestionnaires.createQuestionnaire(questionnaires.getQuestionnaires());
	}



	@PostMapping("/create/question/{id}")
	public CreateQuestion createQuestion(@RequestBody Question questionRequest, @PathVariable String id) {

		

		CreateQuestion questionnaire = CreateQuestion.createQuestion(questionRequest.getQuestion(), questionRequest.getChoix1(), questionRequest.getChoix2(), questionRequest.getChoix3(), questionRequest.getChoix4(), questionRequest.getResponse());

		question.addQuestion(id, questionRequest.getQuestion(), questionRequest.getChoix1(), questionRequest.getChoix2(), questionRequest.getChoix3(), questionRequest.getChoix4(), questionRequest.getResponse());
		

		return questionnaire;
	}

	@GetMapping("/questions/{id}")
	public GetAllQuestions getAllQuestions(@PathVariable String id) {

		List<Question> qcm = question.getQuestions(id);
		return GetAllQuestions.getAllQuestions(qcm);
	}
	@CrossOrigin(origins = "*")
	@GetMapping("/questionnaire/{id}")
	public GetQuestionnaire getQuestionnaire(@PathVariable String id) {

		Questionnaire qcm = questionnaires.getQuestionnaire(id);
		return GetQuestionnaire.getQuestionnaire(qcm);
	}




	

	public void run(String... args) throws Exception {

	}
}