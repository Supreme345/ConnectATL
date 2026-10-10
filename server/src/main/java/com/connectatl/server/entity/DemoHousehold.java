package com.connectatl.server.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "demo_households")
public class DemoHousehold {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "household_id")
    private Long householdId;

    @Column(name = "scenario_name")
    private String scenarioName;

    @Column(name = "county")
    private String county;

    @Column(name = "has_k12_student")
    private Boolean hasK12Student;

    @Column(name = "receives_qualifying_assistance")
    private Boolean receivesQualifyingAssistance;

    @Column(name = "expected_eligible")
    private Boolean expectedEligible;

    public Long getHouseholdId() {
        return householdId;
    }

    public String getScenarioName() {
        return scenarioName;
    }

    public String getCounty() {
        return county;
    }

    public Boolean getHasK12Student() {
        return hasK12Student;
    }

    public Boolean getReceivesQualifyingAssistance() {
        return receivesQualifyingAssistance;
    }

    public Boolean getExpectedEligible() {
        return expectedEligible;
    }
}