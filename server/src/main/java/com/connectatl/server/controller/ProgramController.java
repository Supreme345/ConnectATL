package com.connectatl.server.controller;

import com.connectatl.server.entity.SubsidyProgram;
import com.connectatl.server.repository.SubsidyProgramRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/programs")
public class ProgramController {

    private final SubsidyProgramRepository repository;

    public ProgramController(SubsidyProgramRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<SubsidyProgram> getAllPrograms() {
        return repository.findAll();
    }
}