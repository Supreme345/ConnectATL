package com.connectatl.server.repository;

import com.connectatl.server.entity.InternetPlan;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InternetPlanRepository
        extends JpaRepository<InternetPlan, Long> {
}