package com.connectatl.server.controller;

import com.connectatl.server.dto.AvailabilityRequest;
import com.connectatl.server.dto.AvailabilityResult;
import com.connectatl.server.service.AvailabilityService;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/availability")
public class AvailabilityController {

    private final AvailabilityService availabilityService;

    public AvailabilityController(AvailabilityService availabilityService) {
        this.availabilityService = availabilityService;
    }

    @PostMapping("/check")
    public AvailabilityResult checkAvailability(
            @RequestBody AvailabilityRequest request) {

        return availabilityService.check(request);
    }
}