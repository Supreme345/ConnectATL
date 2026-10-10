package com.connectatl.server.service;

import com.connectatl.server.dto.AvailabilityRequest;
import com.connectatl.server.dto.AvailabilityResult;

import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class AvailabilityService {

    public AvailabilityResult check(AvailabilityRequest request) {

        // TODO: Teammate implements address-level availability lookup.
        // Use verified FCC/provider availability data.
        // Never treat an unverified address as confirmed available.

        return new AvailabilityResult(
                "NOT_IMPLEMENTED",
                List.of(),
                List.of(),
                "Address availability lookup has not been implemented yet.",
                null
        );
    }
}