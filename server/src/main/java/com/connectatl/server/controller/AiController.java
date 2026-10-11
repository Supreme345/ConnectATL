package com.connectatl.server.controller;

import com.connectatl.server.service.AiService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/ai")
public class AiController {

    private final AiService aiService;

    public AiController(AiService aiService) {
        this.aiService = aiService;
    }

    @PostMapping("/explain")
    public ResponseEntity<?> explain(@RequestBody Map<String, String> body) {

        String question = body.getOrDefault("question", "").trim();
        String language = body.getOrDefault("language", "English");

        if (question.isBlank() || question.length() > 1000) {
            return ResponseEntity.badRequest().body(
                Map.of("error", "Question must be between 1 and 1000 characters.")
            );
        }

        if (!language.equalsIgnoreCase("Spanish")) {
            language = "English";
        }

        try {
            String answer = aiService.explain(question, language);
            return ResponseEntity.ok(Map.of("answer", answer));

        } catch (Exception e) {
            System.err.println("AI request failed: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_GATEWAY)
                .body(Map.of("error", "AI assistant temporarily unavailable."));
        }
    }
}