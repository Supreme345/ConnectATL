package com.connectatl.server.controller;

import com.connectatl.server.dto.EligibilityRequest;
import com.connectatl.server.dto.EligibilityResult;
import com.connectatl.server.service.EligibilityService;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/eligibility")
public class EligibilityController {

    private final EligibilityService eligibilityService;

    public EligibilityController(EligibilityService eligibilityService) {
        this.eligibilityService = eligibilityService;
    }

    @PostMapping("/check")
    public EligibilityResult checkEligibility(
            @RequestBody EligibilityRequest request) {

        return eligibilityService.evaluate(request);
    }
}