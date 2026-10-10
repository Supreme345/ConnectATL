package com.connectatl.server.controller;

import com.connectatl.server.entity.InternetPlan;
import com.connectatl.server.repository.InternetPlanRepository;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/plans")
public class InternetPlanController {

    private final InternetPlanRepository repository;

    public InternetPlanController(InternetPlanRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<InternetPlan> getAllPlans() {
        return repository.findAll();
    }
}