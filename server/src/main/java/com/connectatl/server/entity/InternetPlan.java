package com.connectatl.server.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "internet_plans")
public class InternetPlan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "plan_id")
    private Long planId;

    @Column(name = "provider_id")
    private Long providerId;

    @Column(name = "plan_name")
    private String planName;

    @Column(name = "monthly_price")
    private BigDecimal monthlyPrice;

    @Column(name = "download_mbps")
    private BigDecimal downloadMbps;

    @Column(name = "low_income_plan")
    private Boolean lowIncomePlan;

    @Column(name = "plan_url")
    private String planUrl;

    public Long getPlanId() {
        return planId;
    }

    public Long getProviderId() {
        return providerId;
    }

    public String getPlanName() {
        return planName;
    }

    public BigDecimal getMonthlyPrice() {
        return monthlyPrice;
    }

    public BigDecimal getDownloadMbps() {
        return downloadMbps;
    }

    public Boolean getLowIncomePlan() {
        return lowIncomePlan;
    }

    public String getPlanUrl() {
        return planUrl;
    }
}