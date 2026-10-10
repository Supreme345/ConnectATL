
package com.connectatl.server.service;

import com.connectatl.server.dto.EligibilityRequest;
import com.connectatl.server.dto.EligibilityResult;
import com.connectatl.server.entity.EligibilityRule;
import com.connectatl.server.repository.EligibilityRuleRepository;
import com.connectatl.server.repository.SubsidyProgramRepository;

import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class EligibilityService {

    private final EligibilityRuleRepository ruleRepository;
    private final SubsidyProgramRepository programRepository;
    private final ObjectMapper objectMapper;

    public EligibilityService(
            EligibilityRuleRepository ruleRepository,
            SubsidyProgramRepository programRepository,
            ObjectMapper objectMapper) {

        this.ruleRepository = ruleRepository;
        this.programRepository = programRepository;
        this.objectMapper = objectMapper;
    }

    public EligibilityResult evaluate(EligibilityRequest request) {

        List<String> reasons = new ArrayList<>();
        List<String> missing = new ArrayList<>();

        if (request == null || request.programId() == null) {
            return result(null, "NEEDS_MORE_INFO",
                    List.of("A program ID is required."),
                    List.of("programId"), null);
        }

        Long programId = request.programId();

        if (!programRepository.existsById(programId)) {
            return result(programId, "INELIGIBLE",
                    List.of("Program not found."),
                    missing, null);
        }

        List<EligibilityRule> rules =
                ruleRepository.findByProgramId(programId);

        LocalDate today = LocalDate.now();

        rules = rules.stream()
                .filter(rule ->
                        (rule.getEffectiveStart() == null ||
                         !today.isBefore(rule.getEffectiveStart()))
                        &&
                        (rule.getEffectiveEnd() == null ||
                         !today.isAfter(rule.getEffectiveEnd())))
                .toList();

        if (rules.isEmpty()) {
            return result(programId, "NEEDS_MORE_INFO",
                    List.of("No active eligibility rules are available."),
                    missing, null);
        }

        Integer version = null;
        boolean failed = false;
        boolean unknown = false;

        for (EligibilityRule rule : rules) {

            version = rule.getRuleVersion();

            try {
                JsonNode json = objectMapper.readTree(rule.getRuleJson());

                Boolean passed = evaluateNode(
                        json, request, missing);

                if (passed == null) {
                    unknown = true;
                    reasons.add("Could not fully evaluate: "
                            + rule.getRuleName());
                } else if (!passed) {
                    failed = true;
                    reasons.add("Requirement not satisfied: "
                            + rule.getRuleName());
                } else {
                    reasons.add("Requirement satisfied: "
                            + rule.getRuleName());
                }

            } catch (Exception e) {
                unknown = true;
                reasons.add("Unable to interpret rule: "
                        + rule.getRuleName());
            }
        }

        String status;

        if (failed) {
            status = "INELIGIBLE";
        } else if (unknown) {
            status = "NEEDS_MORE_INFO";
        } else {
            status = "ELIGIBLE";
        }

        return result(programId, status, reasons,
                missing.stream().distinct().toList(), version);
    }

    private Boolean evaluateNode(
            JsonNode node,
            EligibilityRequest request,
            List<String> missing) {

        if (node.has("all")) {
            JsonNode children = node.get("all");

            if (!children.isArray() || children.isEmpty()) {
                return null;
            }

            boolean unknown = false;

            for (JsonNode child : children) {
                Boolean value = evaluateNode(child, request, missing);

                if (Boolean.FALSE.equals(value)) {
                    return false;
                }

                if (value == null) {
                    unknown = true;
                }
            }

            return unknown ? null : true;
        }

        if (node.has("any")) {
            JsonNode children = node.get("any");

            if (!children.isArray() || children.isEmpty()) {
                return null;
            }

            boolean unknown = false;

            for (JsonNode child : children) {
                Boolean value = evaluateNode(child, request, missing);

                if (Boolean.TRUE.equals(value)) {
                    return true;
                }

                if (value == null) {
                    unknown = true;
                }
            }

            return unknown ? null : false;
        }

        if (!node.hasNonNull("fact")
                || !node.hasNonNull("operator")
                || !node.has("value")) {
            return null;
        }

        String fact = node.get("fact").asText();
        String operator = node.get("operator").asText();

        Map<String, Object> facts = Map.ofEntries(
                Map.entry("has_k12_student",
                        request.hasK12Student() == null
                                ? "" : request.hasK12Student()),
                Map.entry("receives_qualifying_assistance",
                        request.receivesQualifyingAssistance() == null
                                ? "" : request.receivesQualifyingAssistance()),
                Map.entry("household_size",
                        request.householdSize() == null
                                ? "" : request.householdSize()),
                Map.entry("annual_household_income",
                        request.annualHouseholdIncome() == null
                                ? "" : request.annualHouseholdIncome())
        );

        if (!facts.containsKey(fact)) {
            return null;
        }

        Object actual = facts.get(fact);

        if ("".equals(actual)) {
            missing.add(fact);
            return null;
        }

        JsonNode expected = node.get("value");

        if ("equal".equals(operator)) {
            if (actual instanceof Boolean bool) {
                return expected.isBoolean()
                        ? bool == expected.asBoolean() : null;
            }

            if (actual instanceof Number number && expected.isNumber()) {
                return new BigDecimal(number.toString())
                        .compareTo(expected.decimalValue()) == 0;
            }

            return expected.isTextual()
                    ? actual.toString().equalsIgnoreCase(expected.asText())
                    : null;
        }

        if (actual instanceof Number number && expected.isNumber()) {

            BigDecimal a = new BigDecimal(number.toString());
            BigDecimal b = expected.decimalValue();

            int comparison = a.compareTo(b);

            return switch (operator) {
                case "less_than" -> comparison < 0;
                case "less_than_or_equal" -> comparison <= 0;
                case "greater_than" -> comparison > 0;
                case "greater_than_or_equal" -> comparison >= 0;
                default -> null;
            };
        }

        return null;
    }

    private EligibilityResult result(
            Long programId,
            String status,
            List<String> reasons,
            List<String> missing,
            Integer version) {

        return new EligibilityResult(
                programId, status, reasons, missing, version);
    }
}
