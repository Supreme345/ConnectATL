package com.connectatl.server.controller;

import com.connectatl.server.entity.Provider;
import com.connectatl.server.repository.ProviderRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/providers")
public class ProviderController {

    private final ProviderRepository repository;

    public ProviderController(ProviderRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<Provider> getAllProviders() {
        return repository.findAll();
    }
}