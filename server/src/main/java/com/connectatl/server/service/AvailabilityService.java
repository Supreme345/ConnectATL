
package com.connectatl.server.service;

import com.connectatl.server.dto.AvailabilityRequest;
import com.connectatl.server.dto.AvailabilityResult;

import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class AvailabilityService {

    public AvailabilityResult check(AvailabilityRequest request) {

        List<String> missing = new ArrayList<>();

        if (request == null) {
            return unknown("Address information is required.");
        }

        if (blank(request.streetAddress())) {
            missing.add("street address");
        }

        if (blank(request.city())) {
            missing.add("city");
        }

        if (blank(request.state())) {
            missing.add("state");
        }

        if (blank(request.zipCode())) {
            missing.add("ZIP code");
        }

        if (!missing.isEmpty()) {
            return unknown(
                    "Missing address information: "
                    + String.join(", ", missing));
        }

        String zip = request.zipCode().trim();

        if (!zip.matches("\\d{5}(-\\d{4})?")) {
            return unknown("Invalid ZIP code format.");
        }

        // TODO:
        // Connect a verified FCC/provider availability data source.
        //
        // A valid address alone does not establish service coverage.
        // Do not return AVAILABLE or UNAVAILABLE without evidence.

        return new AvailabilityResult(
                "UNKNOWN",
                List.of(),
                List.of(),
                "Address accepted, but provider availability has not "
                        + "been verified against coverage data.",
                null
        );
    }

    private boolean blank(String value) {
        return value == null || value.isBlank();
    }

    private AvailabilityResult unknown(String explanation) {
        return new AvailabilityResult(
                "UNKNOWN",
                List.of(),
                List.of(),
                explanation,
                null
        );
    }
}
