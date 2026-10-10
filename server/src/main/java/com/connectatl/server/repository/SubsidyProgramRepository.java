package com.connectatl.server.repository;

import com.connectatl.server.entity.SubsidyProgram;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SubsidyProgramRepository
        extends JpaRepository<SubsidyProgram, Long> {
}