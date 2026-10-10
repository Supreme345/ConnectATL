package com.connectatl.server.dto;

import java.util.List;

public record EligibilityResult(
        Long programId,
        String status,
        List<String> reasons,
        List<String> missingInformation,
        Integer ruleVersion
) {}