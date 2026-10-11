
package com.connectatl.server.service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.time.Duration;

import org.springframework.stereotype.Service;

import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

@Service
public class AiService {

    private static final String GEMINI_URL =
        "https://generativelanguage.googleapis.com/v1beta/models/"
        + "gemini-3.5-flash-lite:generateContent";

    private final HttpClient httpClient = HttpClient.newHttpClient();
    private final ObjectMapper mapper = new ObjectMapper();

    public String explain(String question, String language) throws Exception {

        String apiKey = System.getenv("GEMINI_API_KEY");

        if (apiKey == null || apiKey.isBlank()) {
            throw new IllegalStateException("GEMINI_API_KEY is not configured");
        }

        String prompt = """
            You are ConnectATL's affordable internet application assistant.

            Verified demo information:
            - Program: Cox Connect2Compete
            - Listed monthly price: $9.95
            - Listed download speed: 100 Mbps
            - ConnectATL's simplified demo eligibility rule:
              household has a K-12 student AND receives qualifying assistance.
            - Eligibility determined by ConnectATL is preliminary, not
              an official determination by Cox.
            - Official application information:
              https://www.cox.com/residential/internet/connect2compete.html

            Instructions:
            - Explain program requirements and application steps clearly.
            - Never claim that the user's address has verified coverage.
            - Never invent document requirements, eligibility rules, or fees.
            - If a requirement is not verified, tell the user to check
              the official application page.
            - Do not ask for Social Security numbers or sensitive documents.
            - Respond in the requested language.
            - Keep responses concise and practical.

            Language: %s
            User question: %s
            """.formatted(language, question);

        String requestBody = mapper.writeValueAsString(
            java.util.Map.of(
                "contents", java.util.List.of(
                    java.util.Map.of(
                        "parts", java.util.List.of(
                            java.util.Map.of("text", prompt)
                        )
                    )
                )
            )
        );

        HttpRequest request = HttpRequest.newBuilder()
            .uri(URI.create(GEMINI_URL))
            .timeout(Duration.ofSeconds(30))
            .header("x-goog-api-key", apiKey)
            .header("Content-Type", "application/json")
            .POST(HttpRequest.BodyPublishers.ofString(
                requestBody, StandardCharsets.UTF_8
            ))
            .build();

        HttpResponse<String> response = httpClient.send(
            request, HttpResponse.BodyHandlers.ofString()
        );

        if (response.statusCode() != 200) {
            throw new IllegalStateException(
                "Gemini API returned HTTP " + response.statusCode()
            );
        }

        JsonNode json = mapper.readTree(response.body());

        JsonNode parts = json.path("candidates")
            .path(0)
            .path("content")
            .path("parts");

        StringBuilder answer = new StringBuilder();

        if (parts.isArray()) {
            for (JsonNode part : parts) {
                JsonNode text = part.path("text");
                if (text.isTextual()) {
                    answer.append(text.asText());
                }
            }
        }

        if (answer.isEmpty()) {
            throw new IllegalStateException("Gemini returned no text");
        }

        return answer.toString();
    }
}
