package com.connectatl.server.rules;

public record ProgramResult(
    String programName,
    String status,
    String reason
) {}