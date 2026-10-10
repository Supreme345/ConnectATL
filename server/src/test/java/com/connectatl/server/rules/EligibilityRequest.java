package com.connectatl.server.rules;

public record EligibilityRequest(
    String county,
    int householdSize,
    int monthlyIncome,
    boolean receivesSnap,
    boolean receivesMedicaid
) {}