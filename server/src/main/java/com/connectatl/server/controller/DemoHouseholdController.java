package com.connectatl.server.controller;

import com.connectatl.server.entity.DemoHousehold;
import com.connectatl.server.repository.DemoHouseholdRepository;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/demo-households")
public class DemoHouseholdController {

    private final DemoHouseholdRepository repository;

    public DemoHouseholdController(DemoHouseholdRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<DemoHousehold> getAllHouseholds() {
        return repository.findAll();
    }
}