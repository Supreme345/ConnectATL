package com.connectatl.server.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.OffsetDateTime;

@Entity
@Table(name = "subsidy_programs")
public class SubsidyProgram {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "program_id")
    private Long programId;

    @Column(name = "program_name")
    private String programName;

    @Column(name = "description", columnDefinition = "text")
    private String description;

    @Column(name = "eligibility_url", columnDefinition = "text")
    private String eligibilityUrl;

    @Column(name = "application_url", columnDefinition = "text")
    private String applicationUrl;

    @Column(name = "benefit_description", columnDefinition = "text")
    private String benefitDescription;

    @Column(name = "effective_start")
    private LocalDate effectiveStart;

    @Column(name = "effective_end")
    private LocalDate effectiveEnd;

    @Column(name = "last_verified_at")
    private OffsetDateTime lastVerifiedAt;

    @Column(name = "is_active")
    private Boolean isActive;

    public Long getProgramId() {
        return programId;
    }

    public String getProgramName() {
        return programName;
    }

    public String getDescription() {
        return description;
    }

    public String getEligibilityUrl() {
        return eligibilityUrl;
    }

    public String getApplicationUrl() {
        return applicationUrl;
    }

    public String getBenefitDescription() {
        return benefitDescription;
    }

    public LocalDate getEffectiveStart() {
        return effectiveStart;
    }

    public LocalDate getEffectiveEnd() {
        return effectiveEnd;
    }

    public OffsetDateTime getLastVerifiedAt() {
        return lastVerifiedAt;
    }

    public Boolean getIsActive() {
        return isActive;
    }
}