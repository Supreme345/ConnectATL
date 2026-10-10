package com.connectatl.server.entity;

import jakarta.persistence.*;
import java.time.OffsetDateTime;

@Entity
@Table(name = "providers")
public class Provider {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "provider_id")
    private Long providerId;

    @Column(name = "name", length = 150)
    private String name;

    @Column(name = "website_url", columnDefinition = "text")
    private String websiteUrl;

    @Column(name = "application_url", columnDefinition = "text")
    private String applicationUrl;

    @Column(name = "phone", length = 30)
    private String phone;

    @Column(name = "last_verified_at")
    private OffsetDateTime lastVerifiedAt;

    @Column(name = "is_active")
    private Boolean isActive;

    public Long getProviderId() {
        return providerId;
    }

    public String getName() {
        return name;
    }

    public String getWebsiteUrl() {
        return websiteUrl;
    }

    public String getApplicationUrl() {
        return applicationUrl;
    }

    public String getPhone() {
        return phone;
    }

    public OffsetDateTime getLastVerifiedAt() {
        return lastVerifiedAt;
    }

    public Boolean getIsActive() {
        return isActive;
    }
}