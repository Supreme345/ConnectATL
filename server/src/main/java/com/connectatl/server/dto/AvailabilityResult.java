package com.connectatl.server.dto;

import java.util.List;

public record AvailabilityResult(
        String status,
        List<Long> availableProviderIds,
        List<Long> availablePlanIds,
        String explanation,
        String dataSource
) {}