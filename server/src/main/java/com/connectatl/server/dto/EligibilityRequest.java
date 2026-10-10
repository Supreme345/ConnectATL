package com.connectatl.server.dto;

import java.math.BigDecimal;
import java.util.List;

public record EligibilityRequest(
        Long programId,
        String streetAddress,
        String city,
        String state,
        String zipCode,
        String county,
        Integer householdSize,
        BigDecimal annualHouseholdIncome,
        Boolean hasK12Student,
        Boolean receivesQualifyingAssistance,
        List<String> assistancePrograms
) {}