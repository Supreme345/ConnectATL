package com.connectatl.server.repository;

import com.connectatl.server.entity.EligibilityRule;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface EligibilityRuleRepository
        extends JpaRepository<EligibilityRule, Long> {

    List<EligibilityRule> findByProgramId(Long programId);
}