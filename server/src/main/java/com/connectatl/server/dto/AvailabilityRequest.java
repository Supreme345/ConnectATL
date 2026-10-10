package com.connectatl.server.dto;

public record AvailabilityRequest(
        String streetAddress,
        String city,
        String state,
        String zipCode,
        String county
) {}