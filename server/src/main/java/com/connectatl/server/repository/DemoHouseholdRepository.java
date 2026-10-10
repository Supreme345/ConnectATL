package com.connectatl.server.repository;

import com.connectatl.server.entity.DemoHousehold;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DemoHouseholdRepository
        extends JpaRepository<DemoHousehold, Long> {
}