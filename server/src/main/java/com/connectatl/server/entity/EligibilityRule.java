package com.connectatl.server.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

@Entity
@Table(name = "eligibility_rules")
public class EligibilityRule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "rule_id")
    private Long ruleId;

    @Column(name = "program_id")
    private Long programId;

    @Column(name = "rule_name", length = 150)
    private String ruleName;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "rule_json", columnDefinition = "jsonb")
    private String ruleJson;

    @Column(name = "explanation", columnDefinition = "text")
    private String explanation;

    @Column(name = "rule_version")
    private Integer ruleVersion;

    @Column(name = "effective_start")
    private LocalDate effectiveStart;

    @Column(name = "effective_end")
    private LocalDate effectiveEnd;

    @Column(name = "last_verified_at")
    private OffsetDateTime lastVerifiedAt;

    public Long getRuleId() {
        return ruleId;
    }

    public Long getProgramId() {
        return programId;
    }

    public String getRuleName() {
        return ruleName;
    }

    public String getRuleJson() {
        return ruleJson;
    }

    public String getExplanation() {
        return explanation;
    }

    public Integer getRuleVersion() {
        return ruleVersion;
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
}