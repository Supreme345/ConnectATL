package com.connectatl.server.repository;

import com.connectatl.server.entity.Provider;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProviderRepository
        extends JpaRepository<Provider, Long> {
}