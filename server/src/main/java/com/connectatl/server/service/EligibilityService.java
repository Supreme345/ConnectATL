package com.connectatl.server.service;

import com.connectatl.server.dto.EligibilityRequest;
import com.connectatl.server.dto.EligibilityResult;
import com.connectatl.server.repository.EligibilityRuleRepository;
import com.connectatl.server.repository.SubsidyProgramRepository;

import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class EligibilityService {

    private final EligibilityRuleRepository ruleRepository;
    private final SubsidyProgramRepository programRepository;

    public EligibilityService(
            EligibilityRuleRepository ruleRepository,
            SubsidyProgramRepository programRepository) {

        this.ruleRepository = ruleRepository;
        this.programRepository = programRepository;
    }

    public EligibilityResult evaluate(EligibilityRequest request) {

        // TODO: Teammate implements database-driven eligibility logic.
        // Available: ruleRepository and programRepository.

        return new EligibilityResult(
                request.programId(),
                "NOT_IMPLEMENTED",
                List.of("Eligibility engine has not been implemented yet."),
                List.of(),
                null
        );
    }
}